import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useWebRTC } from '../../hooks/useWebRTC';
import { StreamPlayer } from '../../components/StreamPlayer';
import { Monitor, Wifi, Maximize2, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export function DisplayPage() {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [pairingCode, setPairingCode] = useState<string | null>(null);
    const [socketId, setSocketId] = useState<string | null>(null);
    const { socket, connected } = useSocket();
    const { isStreaming } = useWebRTC({
        socket,
        onRemoteStream: (stream) => setRemoteStream(stream)
    });

    useEffect(() => {
        if (connected && socket) {
            setSocketId(socket.id ?? null);
            console.log('[DISPLAY] Connected as:', socket.id, '- Requesting pairing code...');
            socket.emit('pairing:request-code');

            const handleCodeGenerated = ({ code }: { code: string }) => {
                console.log('[DISPLAY] Received pairing code:', code);
                setPairingCode(code);
            };

            socket.on('pairing:code-generated', handleCodeGenerated);

            return () => {
                socket.off('pairing:code-generated', handleCodeGenerated);
            };
        } else {
            setPairingCode(null);
            setSocketId(null);
        }
    }, [connected, socket]);

    const requestNewCode = () => {
        if (socket && connected) {
            console.log('[DISPLAY] Manually requesting new code');
            socket.emit('pairing:request-code');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4">
            {!remoteStream ? (
                <div className="text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-500">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                        <Monitor className="w-24 h-24 text-blue-500 relative" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Display Mode</h1>
                        <p className="text-slate-400">
                            Enter the pairing code on your dashboard to start streaming.
                        </p>
                    </div>

                    {pairingCode ? (
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                            <div className="flex justify-center gap-3" dir="ltr">
                                {pairingCode.split('').map((char, i) => (
                                    <div key={i} className="w-12 h-16 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
                                        <span className="text-3xl font-mono font-bold text-blue-400">{char}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-slate-500 text-xs mt-6 uppercase tracking-widest font-semibold">PAIRING CODE</p>
                            <button
                                onClick={requestNewCode}
                                className="mt-4 text-xs text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1 mx-auto"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Generate New Code
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                            <div className="flex justify-center gap-3" dir="ltr">
                                {['·', '·', '·', '·', '·', '·'].map((char, i) => (
                                    <div key={i} className="w-12 h-16 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner animate-pulse">
                                        <span className="text-3xl font-mono font-bold text-slate-600">{char}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-yellow-500 text-xs mt-6 uppercase tracking-widest font-semibold">CONNECTING TO SERVER...</p>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-4">
                        <Badge variant="outline" className={`${connected ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'} bg-slate-900/50`}>
                            <Wifi className="w-3.5 h-3.5 mr-2" />
                            {connected ? 'CONNECTED' : 'DISCONNECTED'}
                        </Badge>
                        <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900/50">
                            <Maximize2 className="w-3.5 h-3.5 mr-2" />
                            FULLSCREEN READY
                        </Badge>
                    </div>

                    {/* Debug info - socket ID for cross-referencing with server */}
                    {socketId && (
                        <p className="text-slate-700 text-[10px] font-mono">
                            Socket: {socketId}
                        </p>
                    )}

                    <div className="pt-4">
                        <div className="flex gap-1 justify-center">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-blue-500/40 animate-pulse"
                                    style={{ animationDelay: `${i * 200}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full animate-in fade-in duration-1000">
                    <StreamPlayer
                        stream={remoteStream}
                        deviceName="Remote Host"
                        onClose={() => setRemoteStream(null)}
                    />
                </div>
            )}

            {/* Subtle Brand Watermark */}
            <div className="absolute bottom-6 right-8 opacity-20 select-none pointer-events-none">
                <span className="text-white font-bold tracking-widest text-lg">MOBAREZ</span>
            </div>
        </div>
    );
}
