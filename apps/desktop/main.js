const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const os = require('os');
const { exec, spawn, fork } = require('child_process');

// Disable proxy to prevent ERR_FAILED blank screen issues on macOS
app.commandLine.appendSwitch('no-proxy-server');

let virtualDisplayProcess = null;
let agentProcess = null;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'build', 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        title: "Mobarez DisplayExtended (Host)",
    });

    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, 'build', 'icon.png'));
    }

    // System info for registration
    ipcMain.removeHandler('get-system-info');
    ipcMain.handle('get-system-info', () => {
        return {
            name: os.hostname(),
            type: process.platform === 'darwin' ? 'mac' : 'windows',
            resolution: `${mainWindow.getBounds().width}x${mainWindow.getBounds().height}`,
        };
    });

    // Native Screen Capture sources
    ipcMain.removeHandler('get-sources');
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

    // Add error handling instead of failing silently with a blank screen
    mainWindow.loadURL(startUrl).catch(err => {
        console.error('[ELECTRON] Failed to load URL:', err);
        mainWindow.loadURL(`data:text/html;charset=utf-8,
            <html>
            <body style="font-family: sans-serif; padding: 2rem; background: #1a1a1a; color: #fff;">
                <h2>Failed to load Application</h2>
                <p>Target URL: <code>${startUrl}</code></p>
                <p>Error: <code>${err.message}</code></p>
                ${isDev ? '<p><strong>Tip:</strong> Ensure the web dashboard dev server is running (e.g., <code>npm run dev</code> on port 5173).</p>' : '<p>Check your internet connection.</p>'}
            </body>
            </html>
        `);
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Remote Input Simulation using nut.js (cross-platform, native pre-builds)
    const { mouse, keyboard, Key, Point, screen: nutScreen, Button } = require('@nut-tree-fork/nut-js');

    // Remove delay for faster remote control
    nutScreen.config.resourceDirectory = process.cwd();
    mouse.config.mouseSpeed = 2000;

    // Track last known mouse position for click events
    let lastMouseX = 0;
    let lastMouseY = 0;

    ipcMain.removeAllListeners('simulate-input');
    ipcMain.on('simulate-input', async (event, data) => {
        console.log('[ELECTRON-IPC] Received simulate-input:', data.type);

        try {
            const width = await nutScreen.width();
            const height = await nutScreen.height();

            if (data.type === 'mousemove') {
                const absX = Math.round(data.x * width);
                const absY = Math.round(data.y * height);
                lastMouseX = absX;
                lastMouseY = absY;
                await mouse.setPosition(new Point(absX, absY));
            } else if (data.type === 'mousedown') {
                const absX = data.x !== undefined ? Math.round(data.x * width) : lastMouseX;
                const absY = data.y !== undefined ? Math.round(data.y * height) : lastMouseY;
                if (data.x !== undefined || data.y !== undefined) {
                    await mouse.setPosition(new Point(absX, absY));
                }
                const btn = data.button === 2 ? Button.RIGHT : data.button === 1 ? Button.MIDDLE : Button.LEFT;
                await mouse.pressButton(btn);
            } else if (data.type === 'mouseup') {
                const absX = data.x !== undefined ? Math.round(data.x * width) : lastMouseX;
                const absY = data.y !== undefined ? Math.round(data.y * height) : lastMouseY;
                if (data.x !== undefined || data.y !== undefined) {
                    await mouse.setPosition(new Point(absX, absY));
                }
                const btn = data.button === 2 ? Button.RIGHT : data.button === 1 ? Button.MIDDLE : Button.LEFT;
                await mouse.releaseButton(btn);
            } else if (data.type === 'keydown') {
                console.log('[ELECTRON-IPC] keydown:', data.key);
                const key = data.key;

                // Map special keys to Nut.js Key enum
                const keyMap = {
                    'Enter': Key.Enter,
                    'Return': Key.Enter,
                    'Escape': Key.Escape,
                    'Tab': Key.Tab,
                    'Backspace': Key.Backspace,
                    'Delete': Key.Delete,
                    'ArrowUp': Key.Up,
                    'ArrowDown': Key.Down,
                    'ArrowLeft': Key.Left,
                    'ArrowRight': Key.Right,
                    'Space': Key.Space,
                    ' ': Key.Space,
                    'Home': Key.Home,
                    'End': Key.End,
                    'PageUp': Key.PageUp,
                    'PageDown': Key.PageDown,
                    'Shift': Key.LeftShift,
                    'Control': Key.LeftControl,
                    'Alt': Key.LeftAlt,
                    'Meta': Key.LeftSuper,
                };

                // Function keys
                if (/^F[1-9]$|^F1[0-2]$/.test(key)) {
                    keyMap[key] = Key[`F${key.substring(1)}`];
                }

                const nutKey = keyMap[key];

                if (nutKey) {
                    await keyboard.type(nutKey);
                } else if (key.length === 1) {
                    // Single printable character
                    await keyboard.type(key);
                }
            }
        } catch (err) {
            console.error('[ELECTRON-IPC] Input simulation error:', err.message);
        }
    });

    ipcMain.removeHandler('virtual-display:toggle');
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

const { systemPreferences } = require('electron');

async function checkMacPermissions() {
    if (process.platform !== 'darwin') return;

    // 1. Check Screen Recording Permission
    const hasScreenCapture = systemPreferences.getMediaAccessStatus('screen') === 'granted';
    if (!hasScreenCapture) {
        console.log('[ELECTRON] Requesting Screen Recording permission...');
        // On macOS 10.15+, asking for sources automatically triggers the system prompt
        // if the app doesn't have permission yet.
        try {
            await desktopCapturer.getSources({ types: ['screen'] });
        } catch (e) {
            console.log('[ELECTRON] Screen capture request error:', e);
        }
    }

    // 2. Check Accessibility Permission (needed for nut.js remote control)
    const hasAccessibility = systemPreferences.isTrustedAccessibilityClient(false);
    if (!hasAccessibility) {
        console.log('[ELECTRON] Requesting Accessibility permission...');
        // Passing 'true' triggers the macOS system dialog asking the user to grant permission
        systemPreferences.isTrustedAccessibilityClient(true);
    }
}

app.whenReady().then(async () => {
    await checkMacPermissions();
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

    agentProcess = fork(agentPath, [], { stdio: 'pipe' });

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
