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

const DATA_RETRY_INTERVAL = 4000; // Retry data connection every 4s
const DATA_MAX_RETRIES = 5;

type DataChannelState = 'idle' | 'connecting' | 'open' | 'error';

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
    const remotePeerId = useRef<string | null>(null);
    const dcState = useRef<DataChannelState>('idle');

    // Keep refs up to date
    useEffect(() => {
        onRemoteInputRef.current = onRemoteInput;
    }, [onRemoteInput]);
    useEffect(() => {
        onRemoteStreamRef.current = onRemoteStream;
    }, [onRemoteStream]);

    // Bridge remote-input events to Electron IPC, Local Agent, or handle in-browser
    useEffect(() => {
        const handleRemoteInput = (e: any) => {
            const data = e.detail;
            if (!data) return;

            if (onRemoteInputRef.current) {
                onRemoteInputRef.current(data);
            }

            // --- ROUTING LOGIC ---
            // 1. Check if running in Electron
            // @ts-ignore
            const isElectron = !!(window.process?.versions?.electron || (window.require && window.require('electron')));

            if (isElectron) {
                // @ts-ignore
                const ipc = (window as any).ipcRenderer || (window.require && window.require('electron').ipcRenderer);
                if (ipc) {
                    ipc.send('simulate-input', data);
                }
            } else {
                // 2. Check if Local Agent is available (via window-level event or custom hook state bridge)
                // We'll dispatch a custom event that the useAgent hook (or similar) can listen to 
                // but for now, we'll try to use the extension bridge or fallback.

                // Bridge to Browser Extension via CustomEvent
                // @ts-ignore
                if (window.__DISPLAYEXTENDED_EXTENSION_AVAILABLE__ && window.__DISPLAYEXTENDED_NATIVE_HOST_AVAILABLE__) {
                    window.dispatchEvent(new CustomEvent('displayextended-simulate-input', { detail: data }));
                }

                // UI Fallback (Visual feedback)
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
                    setTimeout(() => setRemoteLastKey(null), 1500);
                }
            }
        };

        window.addEventListener('remote-input', handleRemoteInput);
        return () => window.removeEventListener('remote-input', handleRemoteInput);
    }, []);

    // Clear retry timer helper
    const clearRetryTimer = useCallback(() => {
        if (dataRetryTimer.current) {
            clearTimeout(dataRetryTimer.current);
            dataRetryTimer.current = null;
        }
    }, []);

    const setupDataConnection = useCallback((conn: DataConnection) => {
        // Log connection details for debugging
        console.log(`[WEBRTC] 🧩 Attempting to setup data channel with: ${conn.peer} (label: ${conn.label})`);

        // Check for existing state to prevent concurrent connection attempts or overwrites
        if (dcState.current === 'open' && dataConnection.current?.peer === conn.peer) {
            console.log('[WEBRTC] ⏭️ Already have an OPEN data connection to this peer, ignored incoming.');
            conn.close();
            return;
        }

        // If we are already connecting to this peer, don't start another one
        if (dcState.current === 'connecting' && dataConnection.current?.peer === conn.peer && dataConnection.current !== conn) {
            console.log('[WEBRTC] ⏭️ Already have a PENDING connection for this peer, ignored incoming.');
            conn.close();
            return;
        }

        dcState.current = 'connecting';
        dataConnection.current = conn;

        conn.on('open', () => {
            console.log(`[WEBRTC] ✅ Data Channel OPENED with: ${conn.peer}`);
            dcState.current = 'open';
            setDataChannelReady(true);
            clearRetryTimer();
            dataRetryCount.current = 0;

            // Send a ping to verify bidirectional life
            conn.send({ type: 'handshake', status: 'ready' });
        });

        conn.on('data', (data: any) => {
            if (data.type === 'input') {
                window.dispatchEvent(new CustomEvent('remote-input', { detail: data.payload }));
            } else if (data.type === 'handshake') {
                console.log(`[WEBRTC] 🤝 Handshake from ${conn.peer}:`, data.status);
            }
        });

        conn.on('close', () => {
            console.log(`[WEBRTC] 🔴 Data Channel CLOSED with: ${conn.peer}`);
            if (dataConnection.current === conn) {
                dcState.current = 'idle';
                dataConnection.current = null;
                setDataChannelReady(false);
            }
        });

        conn.on('error', (err: any) => {
            console.error(`[WEBRTC] ❌ Data Channel ERROR with ${conn.peer}:`, err);
            if (dataConnection.current === conn) {
                dcState.current = 'error';
                setDataChannelReady(false);
                // We'll let the retry logic (if active) handle it or go back to idle
                setTimeout(() => { if (dcState.current === 'error') dcState.current = 'idle'; }, 1000);
            }
        });

        // Handle case where some PeerJS implementations fire 'open' immediately or if already open
        if (conn.open) {
            console.log('[WEBRTC] ✅ Connection already open at setup time');
            dcState.current = 'open';
            setDataChannelReady(true);
            clearRetryTimer();
        }
    }, [clearRetryTimer]);

    // Retry logic for data connection
    const tryDataConnect = useCallback((targetId: string) => {
        if (!peer || !peer.open) {
            console.warn('[WEBRTC] ⚠️ Peer not ready to connect data channel');
            return;
        }

        if (dcState.current === 'open') return;

        // If a connection attempt is hanging, reset it after a timeout
        if (dcState.current === 'connecting') {
            console.log('[WEBRTC] 🕒 Connection currently negotiating, waiting...');
            return; // Let the existing timer or events handle it
        }

        dataRetryCount.current += 1;
        console.log(`[WEBRTC] 🔄 Data channel attempt ${dataRetryCount.current}/${DATA_MAX_RETRIES} to ${targetId}`);

        try {
            const conn = peer.connect(targetId, DATA_CONNECT_OPTIONS);
            setupDataConnection(conn);

            // Set a deadline for this specific attempt
            dataRetryTimer.current = setTimeout(() => {
                if (dcState.current !== 'open') {
                    console.log(`[WEBRTC] ⏰ Attempt ${dataRetryCount.current} timed out.`);
                    if (dataRetryCount.current < DATA_MAX_RETRIES) {
                        dcState.current = 'idle';
                        tryDataConnect(targetId);
                    } else {
                        console.error('[WEBRTC] ☢️ Max data channel retries reached');
                        dcState.current = 'idle';
                    }
                }
            }, DATA_RETRY_INTERVAL);
        } catch (err) {
            console.error('[WEBRTC] 💣 Exception during connect:', err);
            dcState.current = 'idle';
        }
    }, [peer, setupDataConnection]);

    const startScreenShare = useCallback(async (targetId: string) => {
        if (!peer) return null;
        try {
            console.log('[WEBRTC] 🚀 Starting screen share to:', targetId);
            let stream: MediaStream;

            // @ts-ignore
            const isElectron = window.process?.versions?.electron || (window.require && window.require('electron'));

            if (isElectron) {
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
            dcState.current = 'idle';
            tryDataConnect(targetId);

            // Establish media call
            console.log('[WEBRTC] 📞 Calling remote peer for media...');
            const call = peer.call(targetId, stream);
            mediaConnection.current = call;

            call.on('error', (err) => {
                console.error('[WEBRTC] ❌ Media Call Error:', err);
            });

            return stream;
        } catch (error) {
            console.error('[WEBRTC] ❌ Error starting screen share:', error);
            setIsStreaming(false);
            return null;
        }
    }, [peer, tryDataConnect]);

    const stopStreaming = useCallback(() => {
        console.log('[WEBRTC] 🛑 Stopping stream and closing connections');
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setIsStreaming(false);

        dataConnection.current?.close();
        dataConnection.current = null;
        dcState.current = 'idle';
        setDataChannelReady(false);

        mediaConnection.current?.close();
        mediaConnection.current = null;

        remotePeerId.current = null;
        clearRetryTimer();
        dataRetryCount.current = 0;
    }, [localStream, clearRetryTimer]);

    const sendInputData = useCallback((payload: any) => {
        if (dataConnection.current && dataConnection.current.open) {
            dataConnection.current.send({ type: 'input', payload });
        } else {
            // Only warn occasionally or if we think it should be open
            if (dcState.current === 'open') {
                console.warn('[WEBRTC] ⚠️ Data channel says open but send failed');
            }
        }
    }, []);

    useEffect(() => {
        if (!peer) return;

        // Handle incoming data connections (e.g. if the receiver connects back)
        const handleConnection = (conn: DataConnection) => {
            console.log(`[WEBRTC] 📥 Incoming data connection request from: ${conn.peer}`);

            // Priority management: if we are already connected, ignore new one
            if (dcState.current === 'open') {
                console.log('[WEBRTC] ⏭️ Already have an active connection, rejecting incoming.');
                conn.close();
                return;
            }

            // If we are currently trying to connect, we might want to "yield" to the incoming one
            // to avoid race conditions (glare). For simplicity, we'll accept incoming if idle or connecting.
            clearRetryTimer();
            setupDataConnection(conn);
        };

        // Handle incoming media calls (Display receiver side)
        const handleCall = (call: MediaConnection) => {
            console.log(`[WEBRTC] 📞 Receiving call from: ${call.peer}`);

            call.answer();
            mediaConnection.current = call;
            remotePeerId.current = call.peer;

            call.on('stream', (remoteStream) => {
                console.log('[WEBRTC] 🎥 Remote stream received');
                onRemoteStreamRef.current(remoteStream);
            });

            call.on('close', () => {
                console.log('[WEBRTC] 📞 Media call closed');
                onRemoteStreamRef.current(new MediaStream()); // Clear stream
            });

            // Wait a short moment then try to establish data channel from our side 
            // if the host hasn't done it yet.
            setTimeout(() => {
                if (dcState.current === 'idle') {
                    console.log('[WEBRTC] 🔗 Auto-initiating data connection back to host');
                    tryDataConnect(call.peer);
                }
            }, 1500);
        };

        peer.on('connection', handleConnection);
        peer.on('call', handleCall);

        return () => {
            peer.off('connection', handleConnection);
            peer.off('call', handleCall);
            clearRetryTimer();
        };
    }, [peer, setupDataConnection, tryDataConnect, clearRetryTimer]);

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
