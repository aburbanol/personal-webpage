const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const scenes = [
  {
    id: 'welcome',
    title: 'Welcome',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    colors: {
      background: '#0c1120',
      primary: '#6ee7b7',
      text: '#e5e7eb',
      accent: '#22d3ee',
    },
    hints: 'Introduce yourself and allow sensors to sync with the visuals.',
  },
  {
    id: 'magnetic-waves',
    title: 'Magnetic Waves',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    colors: {
      background: '#0b1729',
      primary: '#a78bfa',
      text: '#e0e7ff',
      accent: '#f59e0b',
    },
    hints: 'Move your device to bend the light ribbons.',
  },
  {
    id: 'lumen-field',
    title: 'Lumen Field',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    colors: {
      background: '#1a1b27',
      primary: '#fbbf24',
      text: '#f3f4f6',
      accent: '#34d399',
    },
    hints: 'Ambient light influences how particles glow.',
  },
];

const serverState = {
  currentScene: scenes[0].id,
  lightLevel: 0.5,
  interactionsEnabled: true,
};

const clients = new Map(); // socket -> client info

function createClientId() {
  return crypto.randomBytes(8).toString('hex');
}

function toJsonMessage(type, payload = {}) {
  return JSON.stringify({ type, ...payload });
}

function encodeWebSocketMessage(message) {
  const payload = Buffer.from(message);
  const payloadLength = payload.length;
  let header;
  if (payloadLength < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81; // text frame
    header[1] = payloadLength;
  } else if (payloadLength < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payloadLength, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(payloadLength), 2);
  }
  return Buffer.concat([header, payload]);
}

function parseFrames(socket, data) {
  socket._buffer = Buffer.concat([socket._buffer || Buffer.alloc(0), data]);
  const messages = [];
  let offset = 0;
  const buffer = socket._buffer;
  while (offset + 2 <= buffer.length) {
    const firstByte = buffer[offset];
    const secondByte = buffer[offset + 1];
    const isMasked = (secondByte & 0x80) === 0x80;
    let payloadLen = secondByte & 0x7f;
    let headerSize = 2;

    if (payloadLen === 126) {
      if (offset + 4 > buffer.length) break;
      payloadLen = buffer.readUInt16BE(offset + 2);
      headerSize = 4;
    } else if (payloadLen === 127) {
      if (offset + 10 > buffer.length) break;
      payloadLen = Number(buffer.readBigUInt64BE(offset + 2));
      headerSize = 10;
    }

    const maskOffset = offset + headerSize;
    const dataOffset = maskOffset + (isMasked ? 4 : 0);
    if (dataOffset + payloadLen > buffer.length) break;

    let payload = buffer.slice(dataOffset, dataOffset + payloadLen);
    if (isMasked) {
      const mask = buffer.slice(maskOffset, maskOffset + 4);
      payload = payload.map((byte, idx) => byte ^ mask[idx % 4]);
    }

    if ((firstByte & 0x0f) === 0x8) {
      socket.end();
      offset = dataOffset + payloadLen;
      continue;
    }

    if ((firstByte & 0x0f) === 0x1) {
      messages.push(payload.toString());
    }
    offset = dataOffset + payloadLen;
  }
  socket._buffer = buffer.slice(offset);
  return messages;
}

function broadcast(message, filterFn = () => true) {
  const payload = encodeWebSocketMessage(message);
  for (const [sock, info] of clients.entries()) {
    if (sock.destroyed || sock.writableEnded) continue;
    if (!filterFn(info)) continue;
    sock.write(payload);
  }
}

function send(socket, type, payload = {}) {
  if (socket.destroyed || socket.writableEnded) return;
  socket.write(encodeWebSocketMessage(toJsonMessage(type, payload)));
}

function updateParticipants() {
  const participants = Array.from(clients.values())
    .filter((c) => c.role === 'participant')
    .map((c) => ({
      id: c.id,
      nickname: c.nickname,
      sensors: c.sensors,
      active: c.active,
    }));
  const adminPayload = toJsonMessage('participantsUpdate', { participants });
  broadcast(adminPayload, (c) => c.role === 'admin');
}

function forwardSensorData(sender, data) {
  const payload = toJsonMessage('sensorData', {
    participantId: sender.id,
    nickname: sender.nickname,
    sensors: sender.sensors,
    data,
  });
  broadcast(payload, (c) => c.role === 'admin' || c.role === 'unity');
}

function handleMessage(socket, msg) {
  let parsed;
  try {
    parsed = JSON.parse(msg);
  } catch (err) {
    return;
  }

  const client = clients.get(socket);
  if (!client) return;

  switch (parsed.type) {
    case 'join': {
      client.role = parsed.role || 'participant';
      client.nickname = parsed.nickname || 'Guest';
      send(socket, 'welcome', {
        clientId: client.id,
        scenes,
        currentScene: serverState.currentScene,
        lightLevel: serverState.lightLevel,
        interactionsEnabled: serverState.interactionsEnabled,
      });
      updateParticipants();
      break;
    }
    case 'sensorAvailability': {
      client.sensors = parsed.sensors || [];
      updateParticipants();
      break;
    }
    case 'sensorData': {
      if (client.role === 'participant') {
        forwardSensorData(client, parsed.data || {});
      }
      break;
    }
    case 'sceneChange': {
      if (client.role === 'admin' || client.role === 'unity') {
        if (scenes.find((scene) => scene.id === parsed.sceneId)) {
          serverState.currentScene = parsed.sceneId;
          broadcast(toJsonMessage('sceneChanged', {
            sceneId: serverState.currentScene,
            scenes,
          }), () => true);
        }
      }
      break;
    }
    case 'lightLevel': {
      if (client.role === 'admin') {
        serverState.lightLevel = Math.max(0, Math.min(1, Number(parsed.value) || 0));
        broadcast(toJsonMessage('lightLevel', { value: serverState.lightLevel }), () => true);
      }
      break;
    }
    case 'toggleInteractions': {
      if (client.role === 'admin') {
        serverState.interactionsEnabled = Boolean(parsed.enabled);
        broadcast(toJsonMessage('interactionsToggled', { enabled: serverState.interactionsEnabled }), () => true);
      }
      break;
    }
    default:
      break;
  }
}

function removeClient(socket) {
  if (clients.has(socket)) {
    clients.delete(socket);
    updateParticipants();
  }
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/client/index.html' : req.url;
  let safePath = path.normalize(urlPath).replace(/^\/+/, '/');
  if (!path.extname(safePath)) {
    safePath = path.join(safePath, 'index.html');
  }
  const filePath = path.join(__dirname, 'public', safePath);
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.on('upgrade', (req, socket) => {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.destroy();
    return;
  }
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }
  const acceptKey = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');
  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKey}`,
  ];
  socket.write(headers.concat('\r\n').join('\r\n'));

  const clientId = createClientId();
  clients.set(socket, {
    id: clientId,
    role: 'participant',
    nickname: 'Guest',
    sensors: [],
    active: true,
  });

  socket.on('data', (data) => {
    const messages = parseFrames(socket, data);
    messages.forEach((msg) => handleMessage(socket, msg));
  });

  socket.on('error', () => removeClient(socket));
  socket.on('close', () => removeClient(socket));
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
