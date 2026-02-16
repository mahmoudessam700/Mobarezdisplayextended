import { useEffect, useState, useCallback, useRef } from 'react';
import type { Peer, DataConnection, MediaConnection } from 'peerjs';

// We'll lazy import PeerJS to avoid SSR issues if any, 
// though Vite handles it fine.
let PeerClass: any = null;

export function usePeer(requestedId?: string) {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [myId, setMyId] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const initPeer = async () => {
            if (!PeerClass) {
                const module = await import('peerjs');
                PeerClass = module.Peer;
            }

            // Create peer with the requested ID (likely the 6-digit code)
            const p = requestedId ? new PeerClass(requestedId) : new PeerClass();

            p.on('open', (id: string) => {
                console.log('[PEER] Connection opened with ID:', id);
                if (isMounted) {
                    setMyId(id);
                    setConnected(true);
                    setPeer(p);
                }
            });

            p.on('error', (err: any) => {
                console.error('[PEER] Error:', err.type, err);
                if (isMounted) {
                    setError(err.type);
                    // Handle ID taken error if needed
                    if (err.type === 'id-taken' && !requestedId) {
                        // Retry with random ID if no ID was requested
                        p.destroy();
                        setPeer(null);
                    }
                }
            });

            p.on('disconnected', () => {
                console.log('[PEER] Disconnected');
                if (isMounted) setConnected(false);
            });

            p.on('close', () => {
                console.log('[PEER] Connection closed');
                if (isMounted) setConnected(false);
            });
        };

        initPeer();

        return () => {
            isMounted = false;
            if (peer) {
                peer.destroy();
            }
        };
    }, [requestedId]);

    return {
        peer,
        myId,
        connected,
        error
    };
}
