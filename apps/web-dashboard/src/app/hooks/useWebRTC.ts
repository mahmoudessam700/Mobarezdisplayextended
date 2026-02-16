import { useEffect, useState, useCallback, useRef } from 'react';
import type { Peer, DataConnection, MediaConnection } from 'peerjs';

interface UseWebRTCOptions {
    peer: Peer | null;
    onRemoteStream: (stream: MediaStream) => void;
    onRemoteInput?: (data: any) => void;
}

const DATA_CONNECT_OPTIONS = {
    reliable: true,
    serialization: 'json' as const,
};

const DATA_RETRY_INTERVAL = 3000; // Retry data connection every 3s
const DATA_MAX_RETRIES = 5;

export function useWebRTC({ peer, onRemoteStream, onRemoteInput }: UseWebRTCOptions) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [dataChannelReady, setDataChannelReady] = useState(false);
    const [remoteCursorPos, setRemoteCursorPos] = useState<{ x: number; y: number } | null>(null);
    const [remoteClickEffect, setRemoteClickEffect] = useState(0);
    const [remoteLastKey, setRemoteLastKey] = useState<string | null>(null);

    const dataConnection = useRef<DataConnection | null>(null);
    const mediaConnection = useRef<MediaConnection | null>(null);
    const onRemoteInputRef = useRef(onRemoteInput);
    const onRemoteStreamRef = useRef(onRemoteStream);
    const dataRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dataRetryCount = useRef(0);
    // Track the remote peer ID for retry logic
    const remotePeerId = useRef<string | null>(null);

    // Keep refs up to date
    useEffect(() => {
        onRemoteInputRef.current = onRemoteInput;
    }, [onRemoteInput]);
    useEffect(() => {
        onRemoteStreamRef.current = onRemoteStream;
    }, [onRemoteStream]);

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
                } else if (data?.type === 'keydown') {
                    setRemoteLastKey(data.key || data.code || 'key');
                    // Auto-clear after 1.5s
                    setTimeout(() => setRemoteLastKey(null), 1500);
                }
            }
        };

        window.addEventListener('remote-input', handleRemoteInput);
        return () => window.removeEventListener('remote-input', handleRemoteInput);
    }, []);

    const setupDataConnection = useCallback((conn: DataConnection) => {
        console.log('[PEER] Setting up data connection, label:', conn.label, 'serialization:', conn.serialization);

        conn.on('open', () => {
            console.log('[PEER] ✅ Data Connection OPEN — channel ready for input');
            setDataChannelReady(true);
            // Clear retry timer on success
            if (dataRetryTimer.current) {
                clearTimeout(dataRetryTimer.current);
                dataRetryTimer.current = null;
            }
            dataRetryCount.current = 0;
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
            console.error('[PEER] ❌ Data Connection Error:', err);
            setDataChannelReady(false);
        });
        dataConnection.current = conn;
        // If the connection is already open (e.g. incoming connection), mark as ready
        if (conn.open) {
            console.log('[PEER] Data connection already open on setup');
            setDataChannelReady(true);
            if (dataRetryTimer.current) {
                clearTimeout(dataRetryTimer.current);
                dataRetryTimer.current = null;
            }
            dataRetryCount.current = 0;
        }
    }, []);

    // Retry logic for data connection
    const tryDataConnect = useCallback((targetId: string) => {
        if (!peer || !peer.open) {
            console.warn('[PEER] Cannot create data connection — peer not open');
            return;
        }
        if (dataConnection.current?.open) {
            console.log('[PEER] Data connection already open, skipping connect');
            return;
        }

        dataRetryCount.current += 1;
        console.log(`[PEER] 🔄 Attempting data connection to ${targetId} (attempt ${dataRetryCount.current}/${DATA_MAX_RETRIES})`);

        try {
            const conn = peer.connect(targetId, DATA_CONNECT_OPTIONS);
            setupDataConnection(conn);

            // Schedule retry if not connected
            if (dataRetryCount.current < DATA_MAX_RETRIES) {
                dataRetryTimer.current = setTimeout(() => {
                    if (!dataConnection.current?.open) {
                        console.log('[PEER] ⏰ Data connection retry triggered');
                        tryDataConnect(targetId);
                    }
                }, DATA_RETRY_INTERVAL);
            } else {
                console.warn(`[PEER] ⚠️ Max data connection retries (${DATA_MAX_RETRIES}) reached for ${targetId}`);
            }
        } catch (err) {
            console.error('[PEER] Error creating data connection:', err);
        }
    }, [peer, setupDataConnection]);

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
            remotePeerId.current = targetId;

            // Establish data connection for remote control (with retries)
            dataRetryCount.current = 0;
            tryDataConnect(targetId);

            // Establish media call
            const call = peer.call(targetId, stream);
            mediaConnection.current = call;

            return stream;
        } catch (error) {
            console.error('Error starting screen share:', error);
            return null;
        }
    }, [peer, tryDataConnect]);

    const stopStreaming = useCallback(() => {
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setIsStreaming(false);
        dataConnection.current?.close();
        dataConnection.current = null;
        setDataChannelReady(false);
        mediaConnection.current?.close();
        mediaConnection.current = null;
        remotePeerId.current = null;
        if (dataRetryTimer.current) {
            clearTimeout(dataRetryTimer.current);
            dataRetryTimer.current = null;
        }
        dataRetryCount.current = 0;
    }, [localStream]);

    const sendInputData = useCallback((payload: any) => {
        if (dataConnection.current && dataConnection.current.open) {
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
            console.log('[PEER] 📥 Incoming data connection from:', conn.peer, 'serialization:', conn.serialization);
            setupDataConnection(conn);
        });

        // Handle incoming media calls (Display receiver)
        peer.on('call', (call) => {
            console.log('[PEER] 📞 Incoming call from:', call.peer);

            // For the display, we automatically answer (no audio/video back)
            call.answer();

            call.on('stream', (remoteStream) => {
                console.log('[PEER] 🎥 Received remote stream');
                onRemoteStreamRef.current(remoteStream);
            });

            mediaConnection.current = call;
            remotePeerId.current = call.peer;

            // Proactively create a data connection back to the caller.
            // PeerJS data connections are separate WebRTC connections from media calls.
            // The HOST's data connection may fail due to ICE/NAT issues, so
            // we also try from the DISPLAY side with retries.
            if (!dataConnection.current?.open) {
                console.log('[PEER] 🔗 Display creating data connection back to HOST:', call.peer);
                dataRetryCount.current = 0;
                tryDataConnect(call.peer);
            }
        });

        return () => {
            peer.off('connection');
            peer.off('call');
            if (dataRetryTimer.current) {
                clearTimeout(dataRetryTimer.current);
                dataRetryTimer.current = null;
            }
        };
    }, [peer, setupDataConnection, tryDataConnect]);

    // Cleanup retry timer on unmount
    useEffect(() => {
        return () => {
            if (dataRetryTimer.current) {
                clearTimeout(dataRetryTimer.current);
            }
        };
    }, []);

    return {
        startScreenShare,
        stopStreaming,
        sendInputData,
        localStream,
        isStreaming,
        dataChannelReady,
        remoteCursorPos,
        remoteClickEffect,
        remoteLastKey
    };
}
