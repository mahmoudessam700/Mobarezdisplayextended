// Content script injected into DisplayExtended dashboard
console.log('[DisplayExtended Extension] Content script loaded');

// Flag to indicate extension is available
window.__DISPLAYEXTENDED_EXTENSION_AVAILABLE__ = true;

// Check if native host is available
chrome.runtime.sendMessage({ type: 'check-native-host' }, (response) => {
    if (response && response.available) {
        console.log('[DisplayExtended Extension] Native host is available');
        window.__DISPLAYEXTENDED_NATIVE_HOST_AVAILABLE__ = true;

        // Dispatch event to notify the page
        window.dispatchEvent(new CustomEvent('displayextended-extension-ready', {
            detail: { nativeHostAvailable: true }
        }));
    } else {
        console.log('[DisplayExtended Extension] Native host not available, attempting connection...');
        window.__DISPLAYEXTENDED_NATIVE_HOST_AVAILABLE__ = false;

        // Try to connect
        chrome.runtime.sendMessage({ type: 'connect-native-host' });

        // Dispatch event anyway
        window.dispatchEvent(new CustomEvent('displayextended-extension-ready', {
            detail: { nativeHostAvailable: false }
        }));
    }
});

// Listen for input simulation requests from the page
window.addEventListener('displayextended-simulate-input', (event) => {
    const inputData = event.detail;
    if (!inputData) return;

    // Low-frequency logging for mousemove, high-frequency for others
    if (inputData.type !== 'mousemove') {
        console.log('[DisplayExtended Extension] 🖱️ Simulating input:', inputData.type, inputData);
    }

    // Forward to background script
    chrome.runtime.sendMessage({
        type: 'simulate-input',
        payload: inputData
    }, (response) => {
        if (response && response.success) {
            // Only log errors or important events to avoid console spam
            if (inputData.type !== 'mousemove') {
                console.log('[DisplayExtended Extension] ✅ Simulated:', inputData.type);
            }
        } else {
            console.error('[DisplayExtended Extension] ❌ Failed to simulate:', inputData.type, response?.error);
        }
    });
});

// Periodically check native host connection
setInterval(() => {
    chrome.runtime.sendMessage({ type: 'check-native-host' }, (response) => {
        const wasAvailable = window.__DISPLAYEXTENDED_NATIVE_HOST_AVAILABLE__;
        const isAvailable = response && response.available;

        if (wasAvailable !== isAvailable) {
            window.__DISPLAYEXTENDED_NATIVE_HOST_AVAILABLE__ = isAvailable;

            // Notify page of status change
            window.dispatchEvent(new CustomEvent('displayextended-native-host-status', {
                detail: { available: isAvailable }
            }));
        }
    });
}, 5000);
