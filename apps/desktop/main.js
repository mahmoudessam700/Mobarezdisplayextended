const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const os = require('os');

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
    const { exec } = require('child_process');

    ipcMain.on('simulate-input', (event, data) => {
        if (process.platform !== 'darwin') return;

        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.size;

        if (data.type === 'mousemove') {
            const absX = Math.round(data.x * width);
            const absY = Math.round(data.y * height);

            // Fast mouse move using AppleScript
            const script = `tell application "System Events" to set the position of the pointer to {${absX}, ${absY}}`;
            // Note: position of pointer requires macOS 11+ or specific accessibility tools.
            // Alternative: use clclick if we can, or a simpler osascript for clicks
            exec(`osascript -e 'tell application "System Events" to click at {${absX}, ${absY}}'`);
        } else if (data.type === 'mousedown') {
            // Simplified: click at current or specific location
            // For full drag support, native modules like robotjs are better, but osascript works for clicks
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
