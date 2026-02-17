import { useEffect, useRef } from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from './ui/button';

interface ExtendedDisplayWindowProps {
    stream: MediaStream | null;
    onClose: () => void;
}

export function ExtendedDisplayWindow({ stream, onClose }: ExtendedDisplayWindowProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        // Request fullscreen on mount
        const enterFullscreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (error) {
                console.log('[Extended Display] Fullscreen request failed:', error);
            }
        };

        enterFullscreen();

        // Handle escape key to exit
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, [onClose]);

    if (!stream) return null;

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
                onCanPlay={() => {
                    console.log('[Extended Display] Video can play');
                    videoRef.current?.play().catch(e => console.error('[Extended Display] Play failed:', e));
                }}
            />

            {/* Minimal controls overlay */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    variant="ghost"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={() => {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                    }}
                >
                    <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Instructions overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm opacity-0 hover:opacity-100 transition-opacity">
                Press <kbd className="px-2 py-1 bg-white/20 rounded">ESC</kbd> to exit extended display
            </div>
        </div>
    );
}
