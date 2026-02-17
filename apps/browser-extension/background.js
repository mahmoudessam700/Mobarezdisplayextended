// Background service worker for native messaging
let nativePort = null;
const NATIVE_HOST_NAME = 'com.displayextended.nativehost';

// Connect to native host
function connectNativeHost() {
    if (nativePort) {
        return; // Already connected
    }

    console.log('[Extension] Connecting to native host...');

    try {
        nativePort = chrome.runtime.connectNative(NATIVE_HOST_NAME);

        nativePort.onMessage.addListener((message) => {
            console.log('[Extension] Message from native host:', message);
            // Forward responses back to content script if needed
            chrome.runtime.sendMessage({ type: 'native-response', data: message });
        });

        nativePort.onDisconnect.addListener(() => {
            console.log('[Extension] Native host disconnected');
            if (chrome.runtime.lastError) {
                console.error('[Extension] Disconnect error:', chrome.runtime.lastError.message);
            }
            nativePort = null;

            // Try to reconnect after 5 seconds
            setTimeout(connectNativeHost, 5000);
        });

        console.log('[Extension] Connected to native host');
    } catch (error) {
        console.error('[Extension] Failed to connect to native host:', error);
        nativePort = null;
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Extension] Message from content script:', message.type);

    if (message.type === 'check-native-host') {
        // Check if native host is available
        sendResponse({ available: nativePort !== null });
        return true;
    }

    if (message.type === 'connect-native-host') {
        connectNativeHost();
        sendResponse({ success: true });
        return true;
    }

    if (message.type === 'simulate-input') {
        // Forward input simulation request to native host
        if (nativePort) {
            try {
                nativePort.postMessage({
                    type: 'input',
                    payload: message.payload
                });
                sendResponse({ success: true });
            } catch (error) {
                console.error('[Extension] Failed to send message:', error);
                sendResponse({ success: false, error: error.message });
            }
        } else {
            console.warn('[Extension] Native host not connected');
            sendResponse({ success: false, error: 'Native host not connected' });
        }
        return true;
    }
});

// Try to connect on startup
connectNativeHost();

// Keep service worker alive
chrome.runtime.onInstalled.addListener(() => {
    console.log('[Extension] Installed');
});
