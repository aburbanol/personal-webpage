const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws';
const wsUrl = `${wsProtocol}://${location.host}`;
let socket = null;
let clientId = null;
const sensorStreams = new Map();
const allowedSensors = new Set();
let sceneStyles = [];

const welcomeView = document.getElementById('welcome-view');
const sensorView = document.getElementById('sensor-view');
const sceneView = document.getElementById('scene-view');
const joinBtn = document.getElementById('join-btn');
const nicknameInput = document.getElementById('nickname');
const sensorList = document.getElementById('sensor-list');
const connectionIndicator = document.getElementById('connection-indicator');
const startStreamBtn = document.getElementById('start-stream');
const stopStreamBtn = document.getElementById('stop-stream');
const sceneBadge = document.getElementById('active-scene');
const sceneDescription = document.getElementById('scene-description');

const sceneDescriptions = {
  welcome: 'Waiting for the show to begin. Keep your device ready.',
  voyage: 'Guide the ship with gentle tilts and rotations.',
  pulse: 'Every shake sends ripples to the scene.'
};

function setScene(sceneId) {
  const palette = sceneStyles.find((scene) => scene.id === sceneId)?.palette;
  if (palette) {
    const root = document.documentElement;
    root.style.setProperty('--bg', palette.background);
    root.style.setProperty('--fg', palette.foreground);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--muted', palette.muted);
    root.style.setProperty('--font', palette.font);
    document.body.style.fontFamily = palette.font;
  }
  document.body.classList.remove('scene-welcome', 'scene-voyage', 'scene-pulse');
  document.body.classList.add(`scene-${sceneId}`);
  sceneBadge.textContent = sceneId;
  sceneDescription.textContent = sceneDescriptions[sceneId] || '';
}

function connect() {
  socket = new WebSocket(wsUrl);

  socket.addEventListener('open', () => {
    connectionIndicator.textContent = 'Connected';
    connectionIndicator.classList.add('online');
    socket.send(
      JSON.stringify({
        type: 'join',
        role: 'mobile',
        nickname: nicknameInput.value
      })
    );
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'welcome' || data.type === 'joined') {
      clientId = data.clientId;
      sceneStyles = data.scenes;
      welcomeView.classList.add('hidden');
      sensorView.classList.remove('hidden');
      sceneView.classList.remove('hidden');
      setScene(data.settings.activeScene);
      renderSensors();
    }

    if (data.type === 'scene_update') {
      setScene(data.activeScene);
    }
  });

  socket.addEventListener('close', () => {
    connectionIndicator.textContent = 'Disconnected';
    connectionIndicator.classList.remove('online');
  });
}

async function requestMotionPermission() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      await DeviceMotionEvent.requestPermission();
    } catch (err) {
      console.warn('Motion permission denied', err);
    }
  }
}

async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      await DeviceOrientationEvent.requestPermission();
    } catch (err) {
      console.warn('Orientation permission denied', err);
    }
  }
}

function renderSensors() {
  const template = document.getElementById('sensor-item-template');
  sensorList.innerHTML = '';
  const sensors = [
    {
      id: 'motion',
      name: 'Acelerómetro + giroscopio',
      details: 'DeviceMotion events (acceleration, rotation rate)',
      available: 'DeviceMotionEvent' in window
    },
    {
      id: 'magnetometer',
      name: 'Magnetómetro',
      details: 'Compass heading via Magnetometer API',
      available: 'Magnetometer' in window
    },
    {
      id: 'light',
      name: 'Luz',
      details: 'Ambient light sensor',
      available: 'AmbientLightSensor' in window
    }
  ];

  sensors.forEach((sensor) => {
    if (!sensor.available) return;
    const node = template.content.cloneNode(true);
    node.querySelector('.sensor-name').textContent = sensor.name;
    node.querySelector('.sensor-details').textContent = sensor.details;
    const checkbox = node.querySelector('input');
    checkbox.checked = allowedSensors.has(sensor.id);
    checkbox.addEventListener('change', () => toggleSensor(sensor.id, checkbox.checked));
    sensorList.appendChild(node);
  });
}

function sendMessage(payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

function toggleSensor(id, enabled) {
  if (enabled) {
    allowedSensors.add(id);
  } else {
    allowedSensors.delete(id);
    stopSensor(id);
  }

  sendMessage({ type: 'sensor_subscription', sensors: Array.from(allowedSensors) });

  if (enabled) {
    startSensor(id);
  }
}

function startSensor(id) {
  switch (id) {
    case 'motion':
      startMotionStream();
      break;
    case 'magnetometer':
      startMagnetometer();
      break;
    case 'light':
      startLightSensor();
      break;
    default:
      break;
  }
}

function stopSensor(id) {
  const stop = sensorStreams.get(id);
  if (stop) stop();
  sensorStreams.delete(id);
}

function startMotionStream() {
  requestMotionPermission();
  requestOrientationPermission();
  const handler = (event) => {
    const payload = {
      acceleration: event.accelerationIncludingGravity || {},
      rotationRate: event.rotationRate || {},
      interval: event.interval
    };
    sendMessage({ type: 'sensor_data', sensors: ['motion'], payload });
  };
  window.addEventListener('devicemotion', handler);
  sensorStreams.set('motion', () => window.removeEventListener('devicemotion', handler));
}

function startMagnetometer() {
  try {
    const magnetometer = new Magnetometer({ frequency: 30 });
    magnetometer.addEventListener('reading', () => {
      sendMessage({
        type: 'sensor_data',
        sensors: ['magnetometer'],
        payload: { x: magnetometer.x, y: magnetometer.y, z: magnetometer.z }
      });
    });
    magnetometer.addEventListener('error', (event) => console.warn('Magnetometer error', event.error));
    magnetometer.start();
    sensorStreams.set('magnetometer', () => magnetometer.stop());
  } catch (err) {
    console.warn('Magnetometer not available', err);
  }
}

function startLightSensor() {
  try {
    const sensor = new AmbientLightSensor();
    sensor.addEventListener('reading', () => {
      sendMessage({ type: 'sensor_data', sensors: ['light'], payload: { illuminance: sensor.illuminance } });
    });
    sensor.addEventListener('error', (event) => console.warn('Ambient light error', event.error));
    sensor.start();
    sensorStreams.set('light', () => sensor.stop());
  } catch (err) {
    console.warn('Ambient light sensor not available', err);
  }
}

joinBtn.addEventListener('click', () => {
  connect();
});

startStreamBtn.addEventListener('click', () => {
  allowedSensors.forEach((id) => startSensor(id));
});

stopStreamBtn.addEventListener('click', () => {
  Array.from(sensorStreams.keys()).forEach((id) => stopSensor(id));
});
