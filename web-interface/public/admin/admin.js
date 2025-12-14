const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws';
const wsUrl = `${wsProtocol}://${location.host}`;
let socket = null;

const userList = document.getElementById('user-list');
const sceneSelect = document.getElementById('scene-select');
const lightRange = document.getElementById('light-range');
const lightValue = document.getElementById('light-value');
const interactionToggle = document.getElementById('interaction-toggle');

function connect() {
  socket = new WebSocket(wsUrl);

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'join', role: 'admin', nickname: 'Server' }));
    socket.send(JSON.stringify({ type: 'request_state' }));
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'server_state') {
      renderUsers(data.users);
      renderScenes(data.scenes, data.settings.activeScene);
      updateControls(data.settings);
    }
  });
}

function renderUsers(users) {
  userList.innerHTML = '';
  if (users.length === 0) {
    userList.innerHTML = '<p>No users connected</p>';
    return;
  }

  users.forEach((user) => {
    const card = document.createElement('div');
    card.className = 'user-card';
    const connectedAgo = formatConnectedAt(user.connectedAt);
    card.innerHTML = `
      <div class="user-title">
        <div class="token">${user.nickname}</div>
        <div class="user-meta">${connectedAgo}</div>
      </div>
      <div class="sensor-badges">${user.sensors
        .map((sensor) => `<span class="badge">${sensor}</span>`)
        .join('')}</div>
    `;
    userList.appendChild(card);
  });
}

function renderScenes(scenes, activeScene) {
  sceneSelect.innerHTML = '';
  scenes.forEach((scene) => {
    const option = document.createElement('option');
    option.value = scene.id;
    option.textContent = scene.name;
    if (scene.id === activeScene) option.selected = true;
    sceneSelect.appendChild(option);
  });
}

function updateControls(settings) {
  lightRange.value = settings.lightLevel;
  lightValue.textContent = Number(settings.lightLevel).toFixed(2);
  interactionToggle.checked = settings.interactionsEnabled;
}

sceneSelect.addEventListener('change', (event) => {
  sendMessage({ type: 'set_scene', sceneId: event.target.value });
});

lightRange.addEventListener('input', (event) => {
  const value = Number(event.target.value);
  lightValue.textContent = value.toFixed(2);
  sendMessage({ type: 'set_light', level: value });
});

interactionToggle.addEventListener('change', (event) => {
  sendMessage({ type: 'set_interactions', enabled: event.target.checked });
});

function sendMessage(payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

function formatConnectedAt(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 min ago';
  return `${minutes} mins ago`;
}

connect();
