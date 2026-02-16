import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Device {
    id: string;
    name: string;
    type: 'mac' | 'windows' | 'linux' | 'android' | 'ios' | 'unknown';
    status: 'available' | 'connected' | 'connecting' | 'disconnected';
    resolution: string;
}

const getSocketUrl = () => {
    const env = (import.meta as any).env;
    if (env && env.VITE_SIGNALING_URL) return env.VITE_SIGNALING_URL;

    // Auto-detect based on current location
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    // If we're on a real domain (not localhost) and no env var is set, 
    // it's unlikely port 4000 on the same domain will work without a reverse proxy.
    // However, we keep the default for now but log it clearly.
    return `${protocol}//${window.location.hostname}:4000`;
};

const SOCKET_URL = getSocketUrl();
console.log('[SOCKET] Attempting to connect to signaling server at:', SOCKET_URL);

// Singleton socket instance to prevent duplicate connections
let globalSocket: Socket | null = null;
let socketRefCount = 0;

function getOrCreateSocket(): Socket {
    if (!globalSocket || globalSocket.disconnected) {
        globalSocket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });
        console.log('[SOCKET] Created new singleton socket');
    }
    socketRefCount++;
    return globalSocket;
}

function releaseSocket() {
    socketRefCount--;
    if (socketRefCount <= 0 && globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
        socketRefCount = 0;
        console.log('[SOCKET] Released singleton socket');
    }
}

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [connected, setConnected] = useState(false);
    const registeredRef = useRef(false);

    useEffect(() => {
        const s = getOrCreateSocket();
        setSocket(s);

        const onConnect = async () => {
            console.log('[SOCKET] Connected to signaling server, id:', s.id);
            setConnected(true);

            // Check if running in Electron
            let deviceInfo = {
                name: 'Web Client ' + Math.floor(Math.random() * 1000),
                type: 'windows' as any,
                resolution: window.screen.width + 'x' + window.screen.height
            };

            try {
                // @ts-ignore
                const isElectron = window.process?.versions?.electron || (window.require && window.require('electron'));
                if (isElectron) {
                    // @ts-ignore
                    const ipc = (window as any).ipcRenderer || (window.require && window.require('electron').ipcRenderer);
                    if (ipc) {
                        const systemInfo = await ipc.invoke('get-system-info');
                        if (systemInfo) {
                            deviceInfo = {
                                ...deviceInfo,
                                ...systemInfo,
                                name: systemInfo.name + ' (Host)'
                            };
                        }
                    }
                }
            } catch (e) {
                console.log('Not running in Electron or IPC failed, using web defaults');
            }

            if (!registeredRef.current) {
                s.emit('device:register', deviceInfo);
                registeredRef.current = true;
            }
        };

        const onDeviceList = (deviceList: Device[]) => {
            setDevices(deviceList);
        };

        const onDisconnect = () => {
            console.log('[SOCKET] Disconnected from signaling server');
            setConnected(false);
        };

        // If already connected, fire immediately
        if (s.connected) {
            setConnected(true);
        }

        s.on('connect', onConnect);
        s.on('device:list', onDeviceList);
        s.on('disconnect', onDisconnect);

        return () => {
            s.off('connect', onConnect);
            s.off('device:list', onDeviceList);
            s.off('disconnect', onDisconnect);
            releaseSocket();
        };
    }, []);

    const sendOffer = useCallback((targetId: string, offer: RTCSessionDescriptionInit) => {
        socket?.emit('webrtc:offer', { targetId, offer });
    }, [socket]);

    const sendAnswer = useCallback((targetId: string, answer: RTCSessionDescriptionInit) => {
        socket?.emit('webrtc:answer', { targetId, answer });
    }, [socket]);

    const sendIceCandidate = useCallback((targetId: string, candidate: RTCIceCandidate) => {
        socket?.emit('webrtc:ice-candidate', { targetId, candidate });
    }, [socket]);

    return {
        socket,
        devices,
        connected,
        sendOffer,
        sendAnswer,
        sendIceCandidate
    };
}
