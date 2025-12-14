const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 4000;

const scenes = [
  {
    id: 'welcome',
    name: 'Welcome',
    palette: {
      background: '#0b1221',
      foreground: '#e5ecff',
      accent: '#53f0c7',
      muted: '#1c2742',
      font: 'Inter, system-ui, -apple-system, sans-serif'
    }
  },
  {
    id: 'voyage',
    name: 'Voyage',
    palette: {
      background: '#0b0d11',
      foreground: '#ffffff',
      accent: '#ff9f1c',
      muted: '#263349',
      font: 'Space Grotesk, system-ui, -apple-system, sans-serif'
    }
  },
  {
    id: 'pulse',
    name: 'Pulse',
    palette: {
      background: '#0f0613',
      foreground: '#f8e7ff',
      accent: '#e64980',
      muted: '#2d1335',
      font: 'Sora, system-ui, -apple-system, sans-serif'
    }
  }
];

const serverSettings = {
  activeScene: scenes[0].id,
  interactionsEnabled: true,
  lightLevel: 0.6
};

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/client')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map();

function send(ws, payload) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcast(filterFn, payload) {
  clients.forEach((client) => {
    if (filterFn(client)) {
      send(client.ws, payload);
    }
  });
}

function snapshotUsers() {
  return Array.from(clients.values())
    .filter((c) => c.role === 'mobile')
    .map((c) => ({
      id: c.id,
      nickname: c.nickname,
      sensors: c.sensors,
      connectedAt: c.connectedAt
    }));
}

function pushServerState() {
  const payload = {
    type: 'server_state',
    users: snapshotUsers(),
    scenes,
    settings: serverSettings
  };
  broadcast((c) => c.role === 'admin', payload);
}

function pushSceneUpdate(sceneId) {
  broadcast(() => true, { type: 'scene_update', activeScene: sceneId });
}

wss.on('connection', (ws) => {
  const id = randomUUID();
  const client = {
    id,
    ws,
    role: 'guest',
    nickname: 'Guest',
    sensors: [],
    connectedAt: Date.now()
  };

  clients.set(id, client);

  send(ws, { type: 'welcome', scenes, settings: serverSettings, clientId: id });

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (err) {
      console.error('Invalid message', err);
      return;
    }

    switch (data.type) {
      case 'join': {
        client.role = data.role || 'mobile';
        client.nickname = data.nickname?.trim() || 'Guest';
        send(ws, { type: 'joined', clientId: id, scenes, settings: serverSettings });
        pushServerState();
        break;
      }
      case 'sensor_subscription': {
        client.sensors = data.sensors || [];
        pushServerState();
        break;
      }
      case 'sensor_data': {
        if (client.role === 'mobile') {
          broadcast((c) => c.role === 'unity', {
            type: 'user_sensor_data',
            userId: client.id,
            nickname: client.nickname,
            sensors: data.sensors,
            payload: data.payload,
            timestamp: Date.now()
          });
          broadcast((c) => c.role === 'admin', {
            type: 'mirror_sensor_data',
            userId: client.id,
            nickname: client.nickname,
            sensors: data.sensors,
            payload: data.payload,
            timestamp: Date.now()
          });
        }
        break;
      }
      case 'request_state': {
        pushServerState();
        break;
      }
      case 'set_scene': {
        if (client.role === 'admin') {
          const sceneExists = scenes.some((scene) => scene.id === data.sceneId);
          if (sceneExists) {
            serverSettings.activeScene = data.sceneId;
            pushSceneUpdate(serverSettings.activeScene);
            pushServerState();
          }
        }
        break;
      }
      case 'set_light': {
        if (client.role === 'admin') {
          serverSettings.lightLevel = Math.max(0, Math.min(1, Number(data.level) || 0));
          broadcast((c) => c.role === 'unity', { type: 'light_level', level: serverSettings.lightLevel });
          pushServerState();
        }
        break;
      }
      case 'set_interactions': {
        if (client.role === 'admin') {
          serverSettings.interactionsEnabled = Boolean(data.enabled);
          broadcast((c) => c.role === 'unity', {
            type: 'interactions',
            enabled: serverSettings.interactionsEnabled
          });
          pushServerState();
        }
        break;
      }
      default:
        break;
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    pushServerState();
  });
});

server.listen(PORT, () => {
  console.log(`Web interface server running on http://localhost:${PORT}`);
});
