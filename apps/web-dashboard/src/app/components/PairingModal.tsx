import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

interface PairingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVerify: (code: string) => void;
}

export function PairingModal({ open, onOpenChange, onVerify }: PairingModalProps) {
    const [code, setCode] = useState("");

    const handleVerify = () => {
        if (code.length === 6) {
            onVerify(code);
            setCode("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect with Pairing Code</DialogTitle>
                    <DialogDescription>
                        Enter the 6-digit code displayed on your other device.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="text-center text-3xl tracking-[1em] font-mono h-16 w-full max-w-[280px]"
                        placeholder="000000"
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleVerify}
                        disabled={code.length !== 6}
                        className="w-full"
                    >
                        Verify & Connect
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
