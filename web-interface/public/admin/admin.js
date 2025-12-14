const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

const participantsEl = document.getElementById('participants');
const participantTemplate = document.getElementById('participant-row');
const userCountEl = document.getElementById('user-count');
const sceneSelect = document.getElementById('scene-select');
const applySceneBtn = document.getElementById('apply-scene');
const lightRange = document.getElementById('light-range');
const lightValue = document.getElementById('light-value');
const toggleInteractionBtn = document.getElementById('toggle-interaction');
const interactionLabel = document.getElementById('interaction-label');
const logEl = document.getElementById('log');

let socket;
let scenes = [];
let interactionsEnabled = true;

function connect() {
  socket = new WebSocket(WS_URL);
  socket.addEventListener('open', () => {
    socket.send(
      JSON.stringify({
        type: 'join',
        role: 'admin',
        nickname: 'Dashboard',
      }),
    );
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'welcome': {
        scenes = data.scenes || [];
        populateScenes(data.currentScene);
        lightRange.value = data.lightLevel;
        lightValue.textContent = Number(data.lightLevel).toFixed(2);
        interactionsEnabled = Boolean(data.interactionsEnabled);
        interactionLabel.textContent = interactionsEnabled ? 'Enabled' : 'Disabled';
        break;
      }
      case 'participantsUpdate': {
        renderParticipants(data.participants || []);
        break;
      }
      case 'sensorData': {
        addLog(`${data.nickname || data.participantId}: ${JSON.stringify(data.data).slice(0, 120)}`);
        break;
      }
      case 'sceneChanged': {
        populateScenes(data.sceneId);
        addLog(`Scene changed to ${data.sceneId}`);
        break;
      }
      case 'lightLevel': {
        lightRange.value = data.value;
        lightValue.textContent = Number(data.value).toFixed(2);
        break;
      }
      case 'interactionsToggled': {
        interactionsEnabled = Boolean(data.enabled);
        interactionLabel.textContent = interactionsEnabled ? 'Enabled' : 'Disabled';
        break;
      }
      default:
        break;
    }
  });

  socket.addEventListener('close', () => {
    addLog('Connection closed. Trying to reconnect in 2s...');
    setTimeout(connect, 2000);
  });
}

function addLog(message) {
  const stamp = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.textContent = `[${stamp}] ${message}`;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

function renderParticipants(participants) {
  participantsEl.innerHTML = '';
  userCountEl.textContent = `${participants.length} online`;
  participants.forEach((p) => {
    const clone = participantTemplate.content.cloneNode(true);
    clone.querySelector('.title').textContent = p.nickname || p.id;
    const subtitle = p.sensors && p.sensors.length ? p.sensors.join(', ') : 'No sensors';
    clone.querySelector('.subtitle').textContent = subtitle;
    clone.querySelector('.pill').textContent = p.active ? 'Active' : 'Idle';
    participantsEl.appendChild(clone);
  });
}

function populateScenes(activeId) {
  sceneSelect.innerHTML = '';
  scenes.forEach((scene) => {
    const option = document.createElement('option');
    option.value = scene.id;
    option.textContent = `${scene.title} (${scene.id})`;
    option.selected = scene.id === activeId;
    sceneSelect.appendChild(option);
  });
}

applySceneBtn.addEventListener('click', () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(
    JSON.stringify({
      type: 'sceneChange',
      sceneId: sceneSelect.value,
    }),
  );
});

lightRange.addEventListener('input', (e) => {
  lightValue.textContent = Number(e.target.value).toFixed(2);
});

lightRange.addEventListener('change', (e) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(
    JSON.stringify({
      type: 'lightLevel',
      value: Number(e.target.value),
    }),
  );
});

toggleInteractionBtn.addEventListener('click', () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  const next = !interactionsEnabled;
  socket.send(
    JSON.stringify({
      type: 'toggleInteractions',
      enabled: next,
    }),
  );
});

connect();
