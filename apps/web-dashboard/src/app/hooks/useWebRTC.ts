import { useEffect, useState, useCallback, useRef } from 'react';
import type { Peer, DataConnection, MediaConnection } from 'peerjs';

interface UseWebRTCOptions {
    peer: Peer | null;
    onRemoteStream: (stream: MediaStream) => void;
}

export function useWebRTC({ peer, onRemoteStream }: UseWebRTCOptions) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const dataConnection = useRef<DataConnection | null>(null);
    const mediaConnection = useRef<MediaConnection | null>(null);

    // Bridge remote-input events to Electron IPC if running in desktop app
    useEffect(() => {
        const handleRemoteInput = (e: any) => {
            const data = e.detail;
            // @ts-ignore
            const isElectron = window.process?.versions?.electron || (window.require && window.require('electron'));
            if (isElectron) {
                // @ts-ignore
                const ipc = (window as any).ipcRenderer || (window.require && window.require('electron').ipcRenderer);
                if (ipc) {
                    ipc.send('simulate-input', data);
                }
            }
        };

        window.addEventListener('remote-input', handleRemoteInput);
        return () => window.removeEventListener('remote-input', handleRemoteInput);
    }, []);

    const setupDataConnection = useCallback((conn: DataConnection) => {
        conn.on('open', () => console.log('[PEER] Data Connection Open'));
        conn.on('data', (data: any) => {
            console.log('[PEER] Received Data:', data);
            if (data.type === 'input') {
                window.dispatchEvent(new CustomEvent('remote-input', { detail: data.payload }));
            }
        });
        conn.on('close', () => console.log('[PEER] Data Connection Closed'));
        dataConnection.current = conn;
    }, []);

    const startScreenShare = useCallback(async (targetId: string) => {
        if (!peer) return null;
        try {
            let stream: MediaStream;

            // @ts-ignore
            const isElectron = window.process?.versions?.electron || (window.require && window.require('electron'));

            if (isElectron) {
                console.log('Detected Electron, using native capture...');
                // @ts-ignore
                const ipc = (window as any).ipcRenderer || (window.require && window.require('electron').ipcRenderer);
                const sources = await ipc.invoke('get-sources');
                const screenSource = sources.find((s: any) => s.id.startsWith('screen'));

                if (screenSource) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            // @ts-ignore
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: screenSource.id,
                                minWidth: 1280,
                                maxWidth: 1920,
                                minHeight: 720,
                                maxHeight: 1080
                            }
                        }
                    } as any);
                } else {
                    throw new Error('No screen sources found');
                }
            } else {
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: { cursor: "always" } as any,
                    audio: true
                });
            }

            setLocalStream(stream);
            setIsStreaming(true);

            // Establish data connection for remote control
            const conn = peer.connect(targetId);
            setupDataConnection(conn);

            // Establish media call
            const call = peer.call(targetId, stream);
            mediaConnection.current = call;

            return stream;
        } catch (error) {
            console.error('Error starting screen share:', error);
            return null;
        }
    }, [peer, setupDataConnection]);

    const stopStreaming = useCallback(() => {
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setIsStreaming(false);
        dataConnection.current?.close();
        dataConnection.current = null;
        mediaConnection.current?.close();
        mediaConnection.current = null;
    }, [localStream]);

    const sendInputData = useCallback((payload: any) => {
        if (dataConnection.current && dataConnection.current.open) {
            dataConnection.current.send({ type: 'input', payload });
        }
    }, []);

    useEffect(() => {
        if (!peer) return;

        // Handle incoming data connections (Remote Control)
        peer.on('connection', (conn) => {
            console.log('[PEER] Incoming data connection from:', conn.peer);
            setupDataConnection(conn);
        });

        // Handle incoming media calls (Display receiver)
        peer.on('call', (call) => {
            console.log('[PEER] Incoming call from:', call.peer);

            // For the display, we automatically answer (no audio/video back)
            call.answer();

            call.on('stream', (remoteStream) => {
                console.log('[PEER] Received remote stream');
                onRemoteStream(remoteStream);
            });

            mediaConnection.current = call;
        });

        return () => {
            peer.off('connection');
            peer.off('call');
        };
    }, [peer, setupDataConnection, onRemoteStream]);

    return {
        startScreenShare,
        stopStreaming,
        sendInputData,
        localStream,
        isStreaming
    };
}

