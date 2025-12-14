# Web Interface for Unity Visuals

This folder contains a lightweight WebSocket server plus two reactive browser front-ends:

- **Mobile client** (`/`): lets audience members join, grant sensor access, and stream motion/light data.
- **Admin console** (`/admin`): lists connected users/sensors and broadcasts scene changes, lighting, and interaction toggles to clients and Unity.

## Quick start

```bash
cd web-interface
npm install
npm start
```

The server defaults to `http://localhost:4000`. Open the root URL on mobile for the client experience and `/admin` for the control dashboard.

## Architecture

- `server.js` hosts static files and coordinates WebSocket messaging for mobiles, admins, and Unity listeners (connect as role `unity`).
- `public/client` renders the mobile flow: join screen, sensor opt-in, and scene-aware UI. Supported sensors: DeviceMotion (accelerometer + gyroscope), Magnetometer, and Ambient Light Sensor (when available in the browser).
- `public/admin` renders the server-side dashboard with user listings and per-scene controls.

The server broadcasts scene updates to all roles and forwards sensor payloads to Unity connections in real time, making it easy to sync the web audience with your visuals.
