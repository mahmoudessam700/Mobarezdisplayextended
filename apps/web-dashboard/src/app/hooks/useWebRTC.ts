import { useEffect, useState, useCallback, useRef } from 'react';
// @ts-ignore
import { Socket } from 'socket.io-client';

interface UseWebRTCOptions {
    socket: Socket | null;
    onRemoteStream: (stream: MediaStream) => void;
}

export function useWebRTC({ socket, onRemoteStream }: UseWebRTCOptions) {
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const dataChannel = useRef<RTCDataChannel | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const setupDataChannel = useCallback((channel: RTCDataChannel) => {
        channel.onopen = () => console.log('[WEBRTC] Data Channel Open');
        channel.onclose = () => console.log('[WEBRTC] Data Channel Closed');
        channel.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('[WEBRTC] Data Channel Message:', data);
                // Handle incoming input events if we are the host
                if (data.type === 'input') {
                    // This will be handled by the specialized host logic
                    window.dispatchEvent(new CustomEvent('remote-input', { detail: data.payload }));
                }
            } catch (e) {
                console.error('[WEBRTC] Error parsing data channel message:', e);
            }
        };
        dataChannel.current = channel;
    }, []);

    const createPeerConnection = useCallback((targetId: string, isSender: boolean) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require'
        });

        if (isSender) {
            const dc = pc.createDataChannel('input-relay', { ordered: false }); // Unordered for lower latency mouse moves
            setupDataChannel(dc);
        }

        pc.ondatachannel = (event) => {
            console.log('[WEBRTC] Received Data Channel');
            setupDataChannel(event.channel);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('webrtc:ice-candidate', { targetId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            console.log('[WEBRTC] Received remote track:', event.track.kind, event.track.label);
            if (event.streams && event.streams[0]) {
                const stream = event.streams[0];
                console.log('[WEBRTC] Stream info:', {
                    id: stream.id,
                    tracks: stream.getTracks().map(t => ({
                        kind: t.kind,
                        label: t.label,
                        enabled: t.enabled,
                        readyState: t.readyState
                    }))
                });
                onRemoteStream(stream);
            }
        };

        peerConnection.current = pc;
        return pc;
    }, [socket, onRemoteStream, setupDataChannel]);

    const startScreenShare = useCallback(async (targetId: string) => {
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

            const pc = createPeerConnection(targetId, true);
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket?.emit('webrtc:offer', { targetId, offer });

            return stream;
        } catch (error) {
            console.error('Error starting screen share:', error);
            return null;
        }
    }, [createPeerConnection, socket]);

    const stopStreaming = useCallback(() => {
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setIsStreaming(false);
        dataChannel.current?.close();
        dataChannel.current = null;
        peerConnection.current?.close();
        peerConnection.current = null;
    }, [localStream]);

    const sendInputData = useCallback((payload: any) => {
        if (dataChannel.current && dataChannel.current.readyState === 'open') {
            dataChannel.current.send(JSON.stringify({ type: 'input', payload }));
        }
    }, []);

    const handleConnectRequest = useCallback(async ({ fromId }: { fromId: string }) => {
        console.log('Received connection request from:', fromId);
        await startScreenShare(fromId);
    }, [startScreenShare]);

    useEffect(() => {
        if (!socket) return;

        const handleOffer = async ({ fromId, offer }: { fromId: string, offer: RTCSessionDescriptionInit }) => {
            const pc = createPeerConnection(fromId, false);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit('webrtc:answer', { targetId: fromId, answer });
        };

        const handleAnswer = async ({ fromId, answer }: { fromId: string, answer: RTCSessionDescriptionInit }) => {
            await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
        };

        const handleIceCandidate = async ({ fromId, candidate }: { fromId: string, candidate: RTCIceCandidateInit }) => {
            try {
                await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        };

        socket.on('webrtc:offer', handleOffer);
        socket.on('webrtc:answer', handleAnswer);
        socket.on('webrtc:ice-candidate', handleIceCandidate);
        socket.on('webrtc:connect-request', handleConnectRequest);

        return () => {
            socket.off('webrtc:offer', handleOffer);
            socket.off('webrtc:answer', handleAnswer);
            socket.off('webrtc:ice-candidate', handleIceCandidate);
            socket.off('webrtc:connect-request', handleConnectRequest);
        };
    }, [socket, createPeerConnection, handleConnectRequest]);

    return {
        startScreenShare,
        stopStreaming,
        sendInputData,
        localStream,
        isStreaming
    };
}
