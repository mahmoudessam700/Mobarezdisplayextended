import { useEffect, useState, useCallback, useRef } from 'react';
// @ts-ignore
import { Socket } from 'socket.io-client';

interface UseWebRTCOptions {
    socket: Socket | null;
    onRemoteStream: (stream: MediaStream) => void;
}

export function useWebRTC({ socket, onRemoteStream }: UseWebRTCOptions) {
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const createPeerConnection = useCallback((targetId: string) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            // Low latency optimizations
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require'
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('webrtc:ice-candidate', { targetId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                onRemoteStream(event.streams[0]);
            }
        };

        peerConnection.current = pc;
        return pc;
    }, [socket, onRemoteStream]);

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
                // Pick the first screen (usually the primary display)
                const screenSource = sources.find((s: any) => s.id.startsWith('screen'));

                if (screenSource) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: false, // Desktop audio capture requires more setup in Electron
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

            const pc = createPeerConnection(targetId);
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
        peerConnection.current?.close();
        peerConnection.current = null;
    }, [localStream]);

    const handleConnectRequest = useCallback(async ({ fromId }: { fromId: string }) => {
        console.log('Received connection request from:', fromId);
        // Auto-start screen share when requested by a remote peer
        await startScreenShare(fromId);
    }, [startScreenShare]);

    useEffect(() => {
        if (!socket) return;

        const handleOffer = async ({ fromId, offer }: { fromId: string, offer: RTCSessionDescriptionInit }) => {
            const pc = createPeerConnection(fromId);
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
        localStream,
        isStreaming
    };
}
