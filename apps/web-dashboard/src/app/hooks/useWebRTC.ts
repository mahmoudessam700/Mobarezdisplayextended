import { useEffect, useState, useCallback, useRef } from 'react';
import type { Peer, DataConnection, MediaConnection } from 'peerjs';

interface UseWebRTCOptions {
    peer: Peer | null;
    onRemoteStream: (stream: MediaStream) => void;
    onRemoteInput?: (data: any) => void;
}

export function useWebRTC({ peer, onRemoteStream, onRemoteInput }: UseWebRTCOptions) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [dataChannelReady, setDataChannelReady] = useState(false);
    const [remoteCursorPos, setRemoteCursorPos] = useState<{ x: number; y: number } | null>(null);
    const [remoteClickEffect, setRemoteClickEffect] = useState(0);

    const dataConnection = useRef<DataConnection | null>(null);
    const mediaConnection = useRef<MediaConnection | null>(null);
    const onRemoteInputRef = useRef(onRemoteInput);

    // Keep onRemoteInput ref up to date
    useEffect(() => {
        onRemoteInputRef.current = onRemoteInput;
    }, [onRemoteInput]);

    // Bridge remote-input events to Electron IPC or handle in-browser
    useEffect(() => {
        const handleRemoteInput = (e: any) => {
            const data = e.detail;
            console.log('[WEBRTC-BRIDGE] Received remote input:', data?.type);

            // Notify callback if provided
            if (onRemoteInputRef.current) {
                onRemoteInputRef.current(data);
            }

            // @ts-ignore
            const isElectron = window.process?.versions?.electron || (window.require && window.require('electron'));
            if (isElectron) {
                // @ts-ignore
                const ipc = (window as any).ipcRenderer || (window.require && window.require('electron').ipcRenderer);
                if (ipc) {
                    ipc.send('simulate-input', data);
                } else {
                    console.warn('[WEBRTC-BRIDGE] IPC not found even though isElectron is true');
                }
            } else {
                // Web-only mode: track remote cursor position for visual overlay
                if (data?.type === 'mousemove') {
                    setRemoteCursorPos({ x: data.x, y: data.y });
                } else if (data?.type === 'mousedown') {
                    if (data.x !== undefined && data.y !== undefined) {
                        setRemoteCursorPos({ x: data.x, y: data.y });
                    }
                    setRemoteClickEffect(prev => prev + 1);
                } else if (data?.type === 'mouseup') {
                    if (data.x !== undefined && data.y !== undefined) {
                        setRemoteCursorPos({ x: data.x, y: data.y });
                    }
                }
            }
        };

        window.addEventListener('remote-input', handleRemoteInput);
        return () => window.removeEventListener('remote-input', handleRemoteInput);
    }, []);

    const setupDataConnection = useCallback((conn: DataConnection) => {
        conn.on('open', () => {
            console.log('[PEER] Data Connection Open — channel ready for input');
            setDataChannelReady(true);
        });
        conn.on('data', (data: any) => {
            console.log('[PEER-DATA] Received:', data);
            if (data.type === 'input') {
                console.log('[PEER-DATA] Dispatching remote-input event:', data.payload?.type);
                window.dispatchEvent(new CustomEvent('remote-input', { detail: data.payload }));
            }
        });
        conn.on('close', () => {
            console.log('[PEER] Data Connection Closed');
            setDataChannelReady(false);
        });
        conn.on('error', (err: any) => {
            console.error('[PEER] Data Connection Error:', err);
            setDataChannelReady(false);
        });
        dataConnection.current = conn;
        // If the connection is already open (e.g. incoming connection), mark as ready
        if (conn.open) {
            console.log('[PEER] Data connection already open on setup');
            setDataChannelReady(true);
        }
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
        setDataChannelReady(false);
        mediaConnection.current?.close();
        mediaConnection.current = null;
    }, [localStream]);

    const sendInputData = useCallback((payload: any) => {
        if (dataConnection.current && dataConnection.current.open) {
            console.log('[PEER-DATA] Sending:', payload);
            dataConnection.current.send({ type: 'input', payload });
        } else {
            console.warn('[PEER-DATA] Cannot send, connection not open. State:', {
                exists: !!dataConnection.current,
                open: dataConnection.current?.open
            });
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
        isStreaming,
        dataChannelReady,
        remoteCursorPos,
        remoteClickEffect
    };
}
