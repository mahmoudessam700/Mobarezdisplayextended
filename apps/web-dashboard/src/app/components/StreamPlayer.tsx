import React, { useEffect, useRef } from 'react';
import { Maximize2, Minimize2, Settings, Wifi } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface StreamPlayerProps {
    stream: MediaStream | null;
    deviceName: string;
    onClose?: () => void;
}

export function StreamPlayer({ stream, deviceName, onClose }: StreamPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) return null;

    return (
        <div className="relative group rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-slate-200/20 dark:border-slate-800/20">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
                onCanPlay={() => {
                    console.log('[STREAM] Video can play');
                    videoRef.current?.play().catch(e => console.error('[STREAM] Play failed:', e));
                }}
                onPlay={() => console.log('[STREAM] Video started playing')}
                onError={(e) => console.error('[STREAM] Video error:', e)}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-none">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                            LIVE
                        </Badge>
                        <span className="text-white font-medium text-sm">{deviceName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                            <Settings className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={onClose}>
                            <Minimize2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">Ultra Low Latency</span>
                </div>
            </div>

            <div className="absolute bottom-4 right-4">
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                    <Maximize2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
