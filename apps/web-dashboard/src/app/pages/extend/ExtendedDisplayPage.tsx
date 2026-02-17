import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Monitor, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ExtendedDisplayWindow } from '../../components/ExtendedDisplayWindow';

export function ExtendedDisplayPage() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [extendedStream, setExtendedStream] = useState<MediaStream | null>(null);
    const pairingCode = code || 'N/A';

    const handleClose = () => {
        navigate('/dashboard');
    };

    // This page will be opened in a new window/tab
    // It will connect to the same peer and receive the "extended" stream

    return (
        <div className="fixed inset-0 bg-slate-950">
            {!extendedStream ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-6 max-w-md p-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                            <Monitor className="w-24 h-24 text-purple-500 relative" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Extended Display</h1>
                            <p className="text-slate-400">
                                Waiting for extended desktop stream...
                            </p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-slate-900/50 mb-4">
                                Pairing Code: {pairingCode}
                            </Badge>
                            <p className="text-slate-500 text-sm">
                                This window is ready to receive your extended display content.
                                Move it to your second monitor for the best experience.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="bg-slate-900/50 border-slate-700 text-white"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Close Extended Display
                        </Button>
                    </div>
                </div>
            ) : (
                <ExtendedDisplayWindow stream={extendedStream} onClose={handleClose} />
            )}
        </div>
    );
}
