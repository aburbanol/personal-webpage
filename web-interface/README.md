# Web interface bridge

A lightweight WebSocket server plus two browser experiences:

- **Client (mobile)** at `/client` for audience participation.
- **Dashboard (admin)** at `/admin` to monitor users, switch scenes and tune interaction parameters.

## Running

```
cd web-interface
node server.js
```

The server serves static assets from `public/` and exposes a raw WebSocket endpoint at `/ws`. No external npm dependencies are required.
