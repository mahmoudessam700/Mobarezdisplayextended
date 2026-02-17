import { useEffect, useState } from 'react';

export function useExtension() {
    const [extensionAvailable, setExtensionAvailable] = useState(false);
    const [nativeHostAvailable, setNativeHostAvailable] = useState(false);

    useEffect(() => {
        // Check if extension is available
        const checkExtension = () => {
            // @ts-ignore
            if (window.__DISPLAYEXTENDED_EXTENSION_AVAILABLE__) {
                setExtensionAvailable(true);
                // @ts-ignore
                setNativeHostAvailable(window.__DISPLAYEXTENDED_NATIVE_HOST_AVAILABLE__ || false);
            }
        };

        // Check immediately
        checkExtension();

        // Listen for extension ready event
        const handleExtensionReady = (event: any) => {
            setExtensionAvailable(true);
            setNativeHostAvailable(event.detail.nativeHostAvailable);
        };

        // Listen for native host status changes
        const handleNativeHostStatus = (event: any) => {
            setNativeHostAvailable(event.detail.available);
        };

        window.addEventListener('displayextended-extension-ready', handleExtensionReady);
        window.addEventListener('displayextended-native-host-status', handleNativeHostStatus);

        // Recheck after a delay in case extension loads late
        const timer = setTimeout(checkExtension, 1000);

        return () => {
            window.removeEventListener('displayextended-extension-ready', handleExtensionReady);
            window.removeEventListener('displayextended-native-host-status', handleNativeHostStatus);
            clearTimeout(timer);
        };
    }, []);

    const simulateInput = (data: any) => {
        if (!extensionAvailable || !nativeHostAvailable) {
            console.warn('[Extension] Cannot simulate input - extension or native host not available');
            return false;
        }

        // Dispatch event to content script
        window.dispatchEvent(new CustomEvent('displayextended-simulate-input', { detail: data }));
        return true;
    };

    return {
        extensionAvailable,
        nativeHostAvailable,
        canControl: extensionAvailable && nativeHostAvailable,
        simulateInput
    };
}
