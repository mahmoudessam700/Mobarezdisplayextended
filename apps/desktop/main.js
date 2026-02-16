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

    ipcMain.on('simulate-input', (event, data) => {
        if (process.platform !== 'darwin') return;

        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.size;

        if (data.type === 'mousemove') {
            const absX = Math.round(data.x * width);
            const absY = Math.round(data.y * height);
            exec(`osascript -e 'tell application "System Events" to set the position of the pointer to {${absX}, ${absY}}'`);
        } else if (data.type === 'mousedown') {
            // Simplified: Treat mousedown as a click for now given AppleScript limitations
            exec(`osascript -e 'tell application "System Events" to click'`);
        } else if (data.type === 'keydown') {
            const key = data.key;
            // Escape double quotes for shell
            const escapedKey = key.replace(/"/g, '\\"');
            if (key.length === 1) {
                // Regular character
                exec(`osascript -e 'tell application "System Events" to keystroke "${escapedKey}"'`);
            } else {
                // Special key (Enter, Escape, etc.)
                const keyMap = {
                    'Enter': 'return',
                    'Escape': 'escape',
                    'Tab': 'tab',
                    'Backspace': 'delete',
                };
                const mappedKey = keyMap[key] || key.toLowerCase();
                exec(`osascript -e 'tell application "System Events" to key code ${mappedKey}'`).catch(() => {
                    // Fallback to keystroke if key code fails or is unknown
                    exec(`osascript -e 'tell application "System Events" to keystroke "${escapedKey}"'`);
                });
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
