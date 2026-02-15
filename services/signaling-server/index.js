const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 4000;

// In-memory device registry
let devices = new Map();

io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    // Device registration
    socket.on('device:register', (deviceInfo) => {
        console.log('Registering device:', deviceInfo.name || socket.id);
        const device = {
            id: socket.id,
            name: deviceInfo.name || 'Unknown Device',
            type: deviceInfo.type || 'unknown',
            status: 'available',
            resolution: deviceInfo.resolution || 'N/A'
        };
        devices.set(socket.id, device);

        // Broadcast updated device list to all clients
        io.emit('device:list', Array.from(devices.values()));
    });

    // Get initial device list
    socket.on('device:request-list', () => {
        socket.emit('device:list', Array.from(devices.values()));
    });

    // Secure Pairing Logic
    const pairingCodes = new Map(); // code -> socketId

    socket.on('pairing:request-code', () => {
        // Generate a random 6-digit code
        let code;
        do {
            code = Math.floor(100000 + Math.random() * 900000).toString();
        } while (pairingCodes.has(code));

        pairingCodes.set(code, socket.id);
        console.log(`Generated pairing code ${code} for socket ${socket.id}`);
        socket.emit('pairing:code-generated', { code });

        // Auto-cleanup after 10 minutes
        setTimeout(() => pairingCodes.delete(code), 600000);
    });

    socket.on('pairing:verify', ({ code }) => {
        const targetId = pairingCodes.get(code);
        if (targetId) {
            console.log(`Pairing successful for code ${code}: ${socket.id} -> ${targetId}`);
            socket.emit('pairing:success', { targetId });
            // Forward connection intent
            socket.to(targetId).emit('webrtc:connect-request', { fromId: socket.id });
            // Cleanup code
            pairingCodes.delete(code);
        } else {
            socket.emit('pairing:error', { message: 'Invalid or expired code' });
        }
    });

    // Room & Pairing Logic (Legacy/Simple)
    socket.on('room:join', (roomId) => {
        console.log(`Socket ${socket.id} joining room: ${roomId}`);
        socket.join(roomId);
        socket.emit('room:joined', roomId);
    });

    socket.on('device:pair', ({ code, deviceId }) => {
        // Simple logic: Room ID is the pairing code
        console.log(`Pairing device ${deviceId} with code ${code}`);
        socket.join(code);
        io.to(code).emit('device:paired', { deviceId, status: 'success' });
    });

    // WebRTC Signaling Handlers
    socket.on('webrtc:connect-request', ({ targetId, settings }) => {
        console.log(`Forwarding connect request from ${socket.id} to ${targetId}`);
        socket.to(targetId).emit('webrtc:connect-request', { fromId: socket.id, settings });
    });

    socket.on('webrtc:offer', ({ targetId, offer }) => {
        console.log(`Forwarding offer from ${socket.id} to ${targetId}`);
        socket.to(targetId).emit('webrtc:offer', { fromId: socket.id, offer });
    });

    socket.on('webrtc:answer', ({ targetId, answer }) => {
        console.log(`Forwarding answer from ${socket.id} to ${targetId}`);
        socket.to(targetId).emit('webrtc:answer', { fromId: socket.id, answer });
    });

    socket.on('webrtc:ice-candidate', ({ targetId, candidate }) => {
        socket.to(targetId).emit('webrtc:ice-candidate', { fromId: socket.id, candidate });
    });

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
        if (devices.has(socket.id)) {
            devices.delete(socket.id);
            io.emit('device:list', Array.from(devices.values()));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Signaling server running on http://localhost:${PORT}`);
});
