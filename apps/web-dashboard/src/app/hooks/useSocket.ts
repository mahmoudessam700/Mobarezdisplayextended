import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Device {
    id: string;
    name: string;
    type: 'mac' | 'windows' | 'linux' | 'android' | 'ios' | 'unknown';
    status: 'available' | 'connected' | 'connecting' | 'disconnected';
    resolution: string;
}

const SOCKET_URL = 'http://localhost:4000';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [connected, setConnected] = useState(false);
    const registeredRef = useRef(false);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', async () => {
            console.log('Connected to signaling server');
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
                newSocket.emit('device:register', deviceInfo);
                registeredRef.current = true;
            }
        });

        newSocket.on('device:list', (deviceList: Device[]) => {
            setDevices(deviceList);
        });

        newSocket.on('disconnect', () => {
            setConnected(false);
        });

        return () => {
            newSocket.disconnect();
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
