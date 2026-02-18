const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const os = require('os');
const { exec, spawn } = require('child_process');

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

    // In production, load the deployed web URL so we use the same PeerJS network.
    // In development, load from the local dev server.
    const startUrl = isDev
        ? 'http://localhost:5173'
        : 'https://displayextend.mm-codes.com';

    console.log('[ELECTRON] Loading URL:', startUrl);
    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Remote Input Simulation using robotjs (cross-platform)
    const robot = require('robotjs');

    // Track last known mouse position for click events
    let lastMouseX = 0;
    let lastMouseY = 0;

    ipcMain.on('simulate-input', (event, data) => {
        console.log('[ELECTRON-IPC] Received simulate-input:', data.type);

        try {
            const screenSize = robot.getScreenSize();
            const { width, height } = screenSize;

            if (data.type === 'mousemove') {
                const absX = Math.round(data.x * width);
                const absY = Math.round(data.y * height);
                lastMouseX = absX;
                lastMouseY = absY;
                robot.moveMouse(absX, absY);
            } else if (data.type === 'mousedown') {
                const absX = data.x !== undefined ? Math.round(data.x * width) : lastMouseX;
                const absY = data.y !== undefined ? Math.round(data.y * height) : lastMouseY;
                console.log(`[ELECTRON-IPC] clicking at: ${absX}, ${absY}`);
                robot.moveMouse(absX, absY);
                robot.mouseToggle('down');
            } else if (data.type === 'mouseup') {
                const absX = data.x !== undefined ? Math.round(data.x * width) : lastMouseX;
                const absY = data.y !== undefined ? Math.round(data.y * height) : lastMouseY;
                robot.moveMouse(absX, absY);
                robot.mouseToggle('up');
            } else if (data.type === 'keydown') {
                console.log('[ELECTRON-IPC] keydown:', data.key);
                const key = data.key;

                // Build modifier array for robotjs
                const modifiers = [];
                if (data.modifiers?.shift) modifiers.push('shift');
                if (data.modifiers?.ctrl || data.modifiers?.control) modifiers.push('control');
                if (data.modifiers?.alt) modifiers.push('alt');
                if (data.modifiers?.meta) modifiers.push('command');

                // Map special keys to robotjs key names
                const keyMap = {
                    'Enter': 'enter',
                    'Return': 'enter',
                    'Escape': 'escape',
                    'Tab': 'tab',
                    'Backspace': 'backspace',
                    'Delete': 'delete',
                    'ArrowUp': 'up',
                    'ArrowDown': 'down',
                    'ArrowLeft': 'left',
                    'ArrowRight': 'right',
                    'Space': 'space',
                    ' ': 'space',
                    'Home': 'home',
                    'End': 'end',
                    'PageUp': 'pageup',
                    'PageDown': 'pagedown',
                    'F1': 'f1', 'F2': 'f2', 'F3': 'f3', 'F4': 'f4',
                    'F5': 'f5', 'F6': 'f6', 'F7': 'f7', 'F8': 'f8',
                    'F9': 'f9', 'F10': 'f10', 'F11': 'f11', 'F12': 'f12',
                };

                const robotKey = keyMap[key] || key.toLowerCase();

                if (modifiers.length > 0) {
                    robot.keyTap(robotKey, modifiers);
                } else if (key.length === 1) {
                    // For single characters, use typeString for better compatibility
                    robot.typeString(key);
                } else {
                    robot.keyTap(robotKey);
                }
            }
        } catch (err) {
            console.error('[ELECTRON-IPC] Input simulation error:', err.message);
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
        if (agentProcess) {
            agentProcess.kill();
        }
    });

    // --- AUTO-LAUNCH AGENT ---
    // This allows the desktop app to provide the WebSocket agent 
    // for all browsers and local dashboard tabs automatically.
    const agentPath = path.join(__dirname, '..', 'agent', 'index.js');
    console.log('[ELECTRON] Launching Agent from:', agentPath);

    const agentProcess = spawn('node', [agentPath]);

    agentProcess.stdout.on('data', (data) => {
        console.log(`[AGENT-LOG] ${data}`);
    });

    agentProcess.stderr.on('data', (data) => {
        console.error(`[AGENT-ERR] ${data}`);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
