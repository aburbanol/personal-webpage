const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

const app = document.getElementById('app');
const welcomeCard = document.getElementById('welcome-card');
const sensorCard = document.getElementById('sensor-card');
const joinBtn = document.getElementById('join-btn');
const nicknameInput = document.getElementById('nickname');
const sensorListEl = document.getElementById('sensor-list');
const sceneTitleEl = document.getElementById('scene-title');
const sceneHintEl = document.getElementById('scene-hint');
const scenePillEl = document.getElementById('scene-pill');
const interactionStateEl = document.getElementById('interaction-state');
const lightLevelEl = document.getElementById('light-level');

const sensorTemplate = document.getElementById('sensor-template');

let socket;
let clientId;
let scenes = [];
let activeScene;
let sensors = [
  {
    id: 'motion',
    label: 'Acelerómetro + giroscopio',
    description: 'Usa devicemotion para giros y aceleraciones.',
    permission: 'gyroscope',
    enabled: false,
    listener: null,
    lastEvent: null,
  },
  {
    id: 'magnetometer',
    label: 'Magnetómetro',
    description: 'Campo magnético ambiental y orientación.',
    permission: 'magnetometer',
    enabled: false,
    listener: null,
    lastEvent: null,
  },
  {
    id: 'light',
    label: 'Sensor de luz',
    description: 'Intensidad de luz en lux (si está disponible).',
    permission: 'ambient-light-sensor',
    enabled: false,
    listener: null,
    lastEvent: null,
  },
];

function connect() {
  socket = new WebSocket(WS_URL);
  socket.addEventListener('open', () => {
    socket.send(
      JSON.stringify({
        type: 'join',
        role: 'participant',
        nickname: nicknameInput.value.trim() || 'Guest',
      }),
    );
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'welcome': {
        clientId = data.clientId;
        scenes = data.scenes || [];
        activeScene = data.currentScene;
        renderScene(activeScene);
        interactionStateEl.textContent = data.interactionsEnabled ? 'Enabled' : 'Disabled';
        lightLevelEl.textContent = Number(data.lightLevel).toFixed(2);
        welcomeCard.classList.add('hidden');
        sensorCard.classList.remove('hidden');
        renderSensors();
        break;
      }
      case 'sceneChanged': {
        activeScene = data.sceneId;
        renderScene(activeScene);
        break;
      }
      case 'lightLevel': {
        lightLevelEl.textContent = Number(data.value).toFixed(2);
        break;
      }
      case 'interactionsToggled': {
        interactionStateEl.textContent = data.enabled ? 'Enabled' : 'Disabled';
        break;
      }
      default:
        break;
    }
  });

  socket.addEventListener('close', () => {
    interactionStateEl.textContent = 'Disconnected';
  });
}

function renderScene(sceneId) {
  const scene = scenes.find((s) => s.id === sceneId);
  if (!scene) return;
  document.body.style.setProperty('--bg', scene.colors.background);
  document.body.style.setProperty('--primary', scene.colors.primary);
  document.body.style.setProperty('--accent', scene.colors.accent);
  document.body.style.fontFamily = scene.fontFamily;
  sceneTitleEl.textContent = scene.title;
  sceneHintEl.textContent = scene.hints;
  scenePillEl.textContent = scene.id;
}

function renderSensors() {
  sensorListEl.innerHTML = '';
  sensors.forEach((sensor) => {
    const clone = sensorTemplate.content.cloneNode(true);
    clone.querySelector('.sensor-name').textContent = sensor.label;
    clone.querySelector('.sensor-desc').textContent = sensor.description;
    const toggle = clone.querySelector('.sensor-toggle');
    toggle.checked = sensor.enabled;
    toggle.addEventListener('change', async (e) => {
      sensor.enabled = e.target.checked;
      if (sensor.enabled) {
        await requestSensor(sensor);
      } else {
        stopSensor(sensor);
      }
      reportSensorAvailability();
    });
    sensorListEl.appendChild(clone);
  });
}

function reportSensorAvailability() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  const enabledIds = sensors.filter((s) => s.enabled).map((s) => s.id);
  socket.send(
    JSON.stringify({
      type: 'sensorAvailability',
      sensors: enabledIds,
    }),
  );
}

function streamData(payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(
    JSON.stringify({
      type: 'sensorData',
      data: payload,
    }),
  );
}

async function requestSensor(sensor) {
  try {
    if ('permissions' in navigator && sensor.permission) {
      const status = await navigator.permissions.query({ name: sensor.permission });
      if (status.state === 'denied') {
        alert(`No permission for ${sensor.label}`);
        sensor.enabled = false;
        renderSensors();
        return;
      }
    }
  } catch (err) {
    console.warn('Permission API not available', err);
  }

  if (sensor.id === 'motion') {
    startMotionSensor(sensor);
  } else if (sensor.id === 'magnetometer') {
    startMagnetometer(sensor);
  } else if (sensor.id === 'light') {
    startLightSensor(sensor);
  }
}

function startMotionSensor(sensor) {
  const handler = (event) => {
    sensor.lastEvent = {
      acceleration: event.accelerationIncludingGravity || event.acceleration || null,
      rotationRate: event.rotationRate || null,
      interval: event.interval,
      timestamp: Date.now(),
    };
  };
  sensor.listener = handler;
  window.addEventListener('devicemotion', handler);
  if (!sensor.interval) {
    sensor.interval = setInterval(() => {
      if (sensor.enabled && sensor.lastEvent) {
        streamData({ motion: sensor.lastEvent });
      }
    }, 120);
  }
}

function startMagnetometer(sensor) {
  if ('Magnetometer' in window) {
    try {
      const mag = new Magnetometer({ frequency: 20 });
      mag.addEventListener('reading', () => {
        if (!sensor.enabled) return;
        streamData({ magnetometer: { x: mag.x, y: mag.y, z: mag.z, timestamp: Date.now() } });
      });
      mag.start();
      sensor.listener = mag;
    } catch (err) {
      console.warn('Magnetometer not available', err);
    }
  } else {
    console.warn('Magnetometer API missing, sending mock data');
    sensor.interval = setInterval(() => {
      if (sensor.enabled) {
        streamData({ magnetometer: { x: 0, y: 0, z: 0, timestamp: Date.now(), mock: true } });
      }
    }, 300);
  }
}

function startLightSensor(sensor) {
  if ('AmbientLightSensor' in window) {
    try {
      const light = new AmbientLightSensor({ frequency: 5 });
      light.addEventListener('reading', () => {
        if (!sensor.enabled) return;
        streamData({ light: { lux: light.illuminance, timestamp: Date.now() } });
      });
      light.start();
      sensor.listener = light;
    } catch (err) {
      console.warn('AmbientLightSensor not available', err);
    }
  } else if ('ondevicelight' in window) {
    const handler = (event) => {
      if (!sensor.enabled) return;
      streamData({ light: { lux: event.value, timestamp: Date.now() } });
    };
    window.addEventListener('devicelight', handler);
    sensor.listener = handler;
  } else {
    console.warn('Light sensor missing, providing fallback values');
    sensor.interval = setInterval(() => {
      if (sensor.enabled) {
        streamData({ light: { lux: Math.random() * 10, timestamp: Date.now(), mock: true } });
      }
    }, 500);
  }
}

function stopSensor(sensor) {
  if (sensor.listener) {
    if (sensor.id === 'motion') {
      window.removeEventListener('devicemotion', sensor.listener);
    } else if (sensor.id === 'magnetometer' && sensor.listener.stop) {
      sensor.listener.stop();
    } else if (sensor.id === 'light' && sensor.listener.removeEventListener) {
      window.removeEventListener('devicelight', sensor.listener);
    }
  }
  if (sensor.interval) {
    clearInterval(sensor.interval);
    sensor.interval = null;
  }
}

joinBtn.addEventListener('click', () => {
  connect();
});
