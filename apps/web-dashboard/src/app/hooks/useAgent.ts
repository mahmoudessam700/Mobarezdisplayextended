import { useEffect, useState, useCallback, useRef } from 'react';

export interface AgentInfo {
    version: string;
    platform: string;
    robotAvailable: boolean;
    virtualDisplayActive: boolean;
}

const AGENT_WS_URL = 'ws://localhost:7822';

export function useAgent() {
    const [agentConnected, setAgentConnected] = useState(false);
    const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
    const [diagnosticResults, setDiagnosticResults] = useState<any | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const connect = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        console.log('[AGENT] Attempting to connect to local agent...');
        const ws = new WebSocket(AGENT_WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('[AGENT] ✅ Connected to local agent');
            setAgentConnected(true);
            setIsChecking(false);
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'ready' || data.type === 'info') {
                    setAgentInfo({
                        version: data.version,
                        platform: data.platform,
                        robotAvailable: data.robotAvailable,
                        virtualDisplayActive: data.virtualDisplayActive || false
                    });
                    if (data.diagnostic) {
                        setDiagnosticResults(data.diagnostic);
                    }
                } else if (data.type === 'diagnostic-result') {
                    setDiagnosticResults(data.results);
                }
            } catch (e) {
                console.error('[AGENT] Failed to parse message:', event.data);
            }
        };

        ws.onclose = () => {
            console.log('[AGENT] 🔴 Disconnected from local agent');
            setAgentConnected(false);
            setAgentInfo(null);
            setIsChecking(false);

            // Reconnect after 3 seconds
            if (!reconnectTimerRef.current) {
                reconnectTimerRef.current = setTimeout(connect, 3000);
            }
        };

        ws.onerror = () => {
            // Error usually means the agent isn't running
            ws.close();
        };
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }
        };
    }, [connect]);

    // Handle incoming events from useWebRTC and forward to agent
    useEffect(() => {
        const handleForwardInput = (e: any) => {
            if (agentConnected && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: 'simulate-input',
                    payload: e.detail
                }));
            }
        };

        window.addEventListener('remote-input', handleForwardInput);
        return () => window.removeEventListener('remote-input', handleForwardInput);
    }, [agentConnected]);

    const sendToAgent = useCallback((message: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
            return true;
        }
        return false;
    }, []);

    const toggleVirtualDisplay = useCallback((enabled: boolean) => {
        return sendToAgent({ type: 'virtual-display:toggle', enabled });
    }, [sendToAgent]);

    const simulateInput = useCallback((data: any) => {
        return sendToAgent({ type: 'simulate-input', payload: data });
    }, [sendToAgent]);

    const runDiagnostic = useCallback(() => {
        return sendToAgent({ type: 'run-diagnostic' });
    }, [sendToAgent]);

    return {
        agentConnected,
        agentInfo,
        diagnosticResults,
        isChecking,
        toggleVirtualDisplay,
        simulateInput,
        runDiagnostic,
        reconnect: connect
    };
}
