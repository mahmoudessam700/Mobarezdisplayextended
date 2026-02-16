require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve the built web dashboard in production
const DASHBOARD_DIST = path.join(__dirname, '../../apps/web-dashboard/dist');
app.use(express.static(DASHBOARD_DIST));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 4000;

// In-memory registries (Global Scope)
let devices = new Map();
const pairingCodes = new Map(); // code -> socketId

io.on('connection', (socket) => {
    console.log(`[SOCKET] Connected: ${socket.id}`);

    // Device registration
    socket.on('device:register', (deviceInfo) => {
        console.log(`[DEVICE] Registering: ${deviceInfo.name || socket.id} (${socket.id})`);
        const device = {
            id: socket.id,
            name: deviceInfo.name || 'Unknown Device',
            type: deviceInfo.type || 'unknown',
            status: 'available',
            resolution: deviceInfo.resolution || 'N/A'
        };
        devices.set(socket.id, device);
        io.emit('device:list', Array.from(devices.values()));
    });

    socket.on('device:request-list', () => {
        socket.emit('device:list', Array.from(devices.values()));
    });

    // Secure Pairing Logic
    socket.on('pairing:request-code', () => {
        let code;
        do {
            code = Math.floor(100000 + Math.random() * 900000).toString();
        } while (pairingCodes.has(code));

        pairingCodes.set(code, socket.id);
        console.log(`[PAIRING] Generated: ${code} for Display: ${socket.id}`);
        console.log(`[PAIRING] Active Codes Map:`, Array.from(pairingCodes.keys()));

        socket.emit('pairing:code-generated', { code });

        // Cleanup after 10 minutes
        setTimeout(() => {
            if (pairingCodes.get(code) === socket.id) {
                pairingCodes.delete(code);
                console.log(`[PAIRING] Cleaned up expired code: ${code}`);
            }
        }, 600000);
    });

    socket.on('pairing:verify', (data) => {
        // Handle both {code} and "code" payloads
        const code = (typeof data === 'object' ? data.code : data).toString().trim();

        console.log(`[PAIRING] Verifying: "${code}" from Dashboard: ${socket.id}`);
        console.log(`[PAIRING] All Active Codes:`, Array.from(pairingCodes.keys()));

        const targetId = pairingCodes.get(code);

        if (targetId) {
            console.log(`[PAIRING] SUCCESS: ${socket.id} -> ${targetId}`);
            socket.emit('pairing:success', { targetId });

            // Forward connection intent to the display client
            socket.to(targetId).emit('webrtc:connect-request', { fromId: socket.id });

            // Remove code after successful use
            pairingCodes.delete(code);
        } else {
            console.warn(`[PAIRING] FAILED: Code "${code}" not found in Map.`);
            socket.emit('pairing:error', { message: 'Invalid or expired code' });
        }
    });

    // WebRTC Signaling Handlers
    socket.on('webrtc:offer', ({ targetId, offer }) => {
        console.log(`[WEBRTC] Offer from ${socket.id} -> ${targetId}`);
        socket.to(targetId).emit('webrtc:offer', { fromId: socket.id, offer });
    });

    socket.on('webrtc:answer', ({ targetId, answer }) => {
        console.log(`[WEBRTC] Answer from ${socket.id} -> ${targetId}`);
        socket.to(targetId).emit('webrtc:answer', { fromId: socket.id, answer });
    });

    socket.on('webrtc:ice-candidate', ({ targetId, candidate }) => {
        console.log(`[WEBRTC] ICE candidate from ${socket.id} -> ${targetId}`);
        socket.to(targetId).emit('webrtc:ice-candidate', { fromId: socket.id, candidate });
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] Disconnected: ${socket.id}`);
        devices.delete(socket.id);

        // Clean up any codes associated with this socket
        for (const [code, id] of pairingCodes.entries()) {
            if (id === socket.id) {
                pairingCodes.delete(code);
                console.log(`[PAIRING] Removed code ${code} due to disconnect`);
            }
        }

        io.emit('device:list', Array.from(devices.values()));
    });
});

// SPA fallback: serve index.html for any non-API, non-socket route
app.get('*', (req, res) => {
    res.sendFile(path.join(DASHBOARD_DIST, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Signaling server running on http://0.0.0.0:${PORT}`);
    console.log(`[SERVER] Dashboard served from: ${DASHBOARD_DIST}`);
});
