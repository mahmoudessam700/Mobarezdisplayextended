const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const os = require('os');

let virtualDisplayProcess = null;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        title: "Mobarez DisplayExtended (Host)",
    });

    // System info for registration
    ipcMain.handle('get-system-info', () => {
        return {
            name: os.hostname(),
            type: process.platform === 'darwin' ? 'mac' : 'windows',
            resolution: `${mainWindow.getBounds().width}x${mainWindow.getBounds().height}`,
        };
    });

    // Native Screen Capture sources
    ipcMain.handle('get-sources', async () => {
        const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
        return sources.map(source => ({
            id: source.id,
            name: source.name,
            thumbnail: source.thumbnail.toDataURL(),
        }));
    });

    // In production, we would load the built frontend.
    // In development, we load from the dev server.
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../web-dashboard/dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Remote Input Simulation
    const { screen } = require('electron');
    const { exec, spawn } = require('child_process');
    const fs = require('fs');

    // Track last known mouse position for click events
    let lastMouseX = 0;
    let lastMouseY = 0;

    ipcMain.on('simulate-input', (event, data) => {
        console.log('[ELECTRON-IPC] Received simulate-input:', data.type);
        if (process.platform !== 'darwin') {
            console.warn('[ELECTRON-IPC] Input simulation only supported on macOS');
            return;
        }

        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.size;

        if (data.type === 'mousemove') {
            const absX = Math.round(data.x * width);
            const absY = Math.round(data.y * height);
            lastMouseX = absX;
            lastMouseY = absY;
            // Use CGEvent via JXA (JavaScript for Automation) — works on modern macOS
            const jxaScript = `
                ObjC.import('CoreGraphics');
                var point = $.CGPointMake(${absX}, ${absY});
                var moveEvent = $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, point, 0);
                $.CGEventPost($.kCGHIDEventTap, moveEvent);
            `;
            exec(`osascript -l JavaScript -e '${jxaScript.replace(/'/g, "'\\''")}'`, (err) => {
                if (err) console.error('[ELECTRON-IPC] Mouse move error:', err.message);
            });
        } else if (data.type === 'mousedown') {
            const absX = data.x !== undefined ? Math.round(data.x * width) : lastMouseX;
            const absY = data.y !== undefined ? Math.round(data.y * height) : lastMouseY;
            console.log(`[ELECTRON-IPC] clicking at: ${absX}, ${absY}`);
            const jxaScript = `
                ObjC.import('CoreGraphics');
                var point = $.CGPointMake(${absX}, ${absY});
                var downEvent = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDown, point, 0);
                $.CGEventPost($.kCGHIDEventTap, downEvent);
            `;
            exec(`osascript -l JavaScript -e '${jxaScript.replace(/'/g, "'\\''")}'`, (err) => {
                if (err) console.error('[ELECTRON-IPC] Mouse down error:', err.message);
            });
        } else if (data.type === 'mouseup') {
            const absX = data.x !== undefined ? Math.round(data.x * width) : lastMouseX;
            const absY = data.y !== undefined ? Math.round(data.y * height) : lastMouseY;
            const jxaScript = `
                ObjC.import('CoreGraphics');
                var point = $.CGPointMake(${absX}, ${absY});
                var upEvent = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseUp, point, 0);
                $.CGEventPost($.kCGHIDEventTap, upEvent);
            `;
            exec(`osascript -l JavaScript -e '${jxaScript.replace(/'/g, "'\\''")}'`, (err) => {
                if (err) console.error('[ELECTRON-IPC] Mouse up error:', err.message);
            });
        } else if (data.type === 'keydown') {
            console.log('[ELECTRON-IPC] keydown:', data.key);
            const key = data.key;
            const escapedKey = key.replace(/"/g, '\\"');
            if (key.length === 1) {
                // Regular character keystroke via AppleScript (this works fine)
                exec(`osascript -e 'tell application "System Events" to keystroke "${escapedKey}"'`, (err) => {
                    if (err) console.error('[ELECTRON-IPC] Keystroke error:', err.message);
                });
            } else {
                // Special keys using key codes
                const keyCodeMap = {
                    'Enter': 36,
                    'Return': 36,
                    'Escape': 53,
                    'Tab': 48,
                    'Backspace': 51,
                    'Delete': 117,
                    'ArrowUp': 126,
                    'ArrowDown': 125,
                    'ArrowLeft': 123,
                    'ArrowRight': 124,
                    'Space': 49,
                    ' ': 49,
                    'Home': 115,
                    'End': 119,
                    'PageUp': 116,
                    'PageDown': 121,
                    'F1': 122, 'F2': 120, 'F3': 99, 'F4': 118,
                    'F5': 96, 'F6': 97, 'F7': 98, 'F8': 100,
                    'F9': 101, 'F10': 109, 'F11': 103, 'F12': 111,
                };
                const keyCode = keyCodeMap[key];
                if (keyCode !== undefined) {
                    // Build modifier flags
                    let modifierParts = [];
                    if (data.modifiers?.shift) modifierParts.push('shift down');
                    if (data.modifiers?.ctrl) modifierParts.push('control down');
                    if (data.modifiers?.alt) modifierParts.push('option down');
                    if (data.modifiers?.meta) modifierParts.push('command down');
                    const usingClause = modifierParts.length > 0 ? ` using {${modifierParts.join(', ')}}` : '';
                    exec(`osascript -e 'tell application "System Events" to key code ${keyCode}${usingClause}'`, (err) => {
                        if (err) console.error('[ELECTRON-IPC] Key code error:', err.message);
                    });
                } else {
                    console.warn('[ELECTRON-IPC] Unknown special key:', key);
                }
            }
        }
    });

    ipcMain.handle('virtual-display:toggle', async (event, enabled) => {
        if (process.platform !== 'darwin') return { success: false, message: 'Only supported on macOS' };

        if (enabled) {
            if (virtualDisplayProcess) return { success: true };

            const swiftFile = path.join(__dirname, 'virtual_display_helper.swift');
            const binaryFile = path.join(__dirname, 'virtual_display_helper');

            return new Promise((resolve) => {
                // Compile on the fly
                exec(`swiftc "${swiftFile}" -o "${binaryFile}"`, (error) => {
                    if (error) {
                        console.error('[ELECTRON] Swift compilation failed:', error);
                        return resolve({ success: false, message: 'Compilation failed' });
                    }

                    console.log('[ELECTRON] Swift helper compiled. Starting...');
                    virtualDisplayProcess = spawn(binaryFile);

                    virtualDisplayProcess.stdout.on('data', (data) => {
                        console.log(`[SWIFT] ${data}`);
                    });

                    virtualDisplayProcess.on('error', (err) => {
                        console.error('[ELECTRON] Virtual display process error:', err);
                    });

                    virtualDisplayProcess.on('close', (code) => {
                        console.log(`[ELECTRON] Virtual display process exited with code ${code}`);
                        virtualDisplayProcess = null;
                    });

                    resolve({ success: true });
                });
            });
        } else {
            if (virtualDisplayProcess) {
                virtualDisplayProcess.kill();
                virtualDisplayProcess = null;
            }
            return { success: true };
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Cleanup on exit
    app.on('will-quit', () => {
        if (virtualDisplayProcess) {
            virtualDisplayProcess.kill();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
