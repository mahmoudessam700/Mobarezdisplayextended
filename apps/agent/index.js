#!/usr/bin/env node

/**
 * DisplayExtend Local Agent
 * 
 * Runs a WebSocket server on ws://localhost:7822
 * The web dashboard auto-connects to this for:
 *   - Remote input simulation (mouse/keyboard via robotjs)
 *   - Virtual display creation/removal
 * 
 * Install as a system service so it auto-starts on login:
 *   node install.js
 */

const { WebSocketServer } = require('ws');
const { exec, spawn } = require('child_process');
const path = require('path');
const os = require('os');

let robot;
try {
    robot = require('robotjs');
} catch (e) {
    console.error('[Agent] ⚠️  robotjs not found. Run: npm install');
    console.error('[Agent]    Input simulation will be disabled.');
    robot = null;
}

const PORT = 7822;
const AGENT_VERSION = '1.0.0';

let virtualDisplayProcess = null;
let lastMouseX = 0;
let lastMouseY = 0;

// ─── Input Simulation ────────────────────────────────────────────────────────

function simulateInput(data) {
    if (!robot) return { success: false, error: 'robotjs not available' };

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
            const button = data.button === 2 ? 'right' : data.button === 1 ? 'middle' : 'left';
            lastMouseX = absX;
            lastMouseY = absY;
            robot.moveMouse(absX, absY);
            robot.mouseToggle('down', button);

        } else if (data.type === 'mouseup') {
            const absX = data.x !== undefined ? Math.round(data.x * width) : lastMouseX;
            const absY = data.y !== undefined ? Math.round(data.y * height) : lastMouseY;
            const button = data.button === 2 ? 'right' : data.button === 1 ? 'middle' : 'left';
            robot.moveMouse(absX, absY);
            robot.mouseToggle('up', button);

        } else if (data.type === 'scroll') {
            robot.scrollMouse(Math.round(data.deltaX || 0), Math.round(data.deltaY || 0));

        } else if (data.type === 'keydown') {
            const key = data.key;
            const modifiers = [];
            if (data.modifiers?.shift) modifiers.push('shift');
            if (data.modifiers?.ctrl || data.modifiers?.control) modifiers.push('control');
            if (data.modifiers?.alt) modifiers.push('alt');
            if (data.modifiers?.meta) modifiers.push('command');

            const keyMap = {
                'Enter': 'enter', 'Return': 'enter', 'Escape': 'escape',
                'Tab': 'tab', 'Backspace': 'backspace', 'Delete': 'delete',
                'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right',
                'Space': 'space', ' ': 'space',
                'Home': 'home', 'End': 'end', 'PageUp': 'pageup', 'PageDown': 'pagedown',
                'F1': 'f1', 'F2': 'f2', 'F3': 'f3', 'F4': 'f4',
                'F5': 'f5', 'F6': 'f6', 'F7': 'f7', 'F8': 'f8',
                'F9': 'f9', 'F10': 'f10', 'F11': 'f11', 'F12': 'f12',
            };

            const robotKey = keyMap[key] || key.toLowerCase();

            if (modifiers.length > 0) {
                robot.keyTap(robotKey, modifiers);
            } else if (key && key.length === 1) {
                robot.typeString(key);
            } else {
                robot.keyTap(robotKey);
            }
        }

        return { success: true };
    } catch (err) {
        console.error('[Agent] Input simulation error:', err.message);
        return { success: false, error: err.message };
    }
}

// ─── Virtual Display ──────────────────────────────────────────────────────────

function toggleVirtualDisplay(enabled, callback) {
    if (enabled) {
        if (virtualDisplayProcess) {
            return callback({ success: true, message: 'Already active' });
        }

        if (process.platform === 'darwin') {
            // macOS: compile and run the Swift helper
            const swiftFile = path.join(__dirname, '..', 'desktop', 'virtual_display_helper.swift');
            const binaryFile = path.join(os.tmpdir(), 'displayextend_virtual_display');

            exec(`swiftc "${swiftFile}" -o "${binaryFile}"`, (error) => {
                if (error) {
                    console.error('[Agent] Swift compilation failed:', error.message);
                    return callback({ success: false, message: 'Swift compilation failed: ' + error.message });
                }

                virtualDisplayProcess = spawn(binaryFile);

                virtualDisplayProcess.stdout.on('data', (data) => {
                    console.log(`[Agent/Swift] ${data.toString().trim()}`);
                });

                virtualDisplayProcess.on('error', (err) => {
                    console.error('[Agent] Virtual display process error:', err);
                    virtualDisplayProcess = null;
                });

                virtualDisplayProcess.on('close', (code) => {
                    console.log(`[Agent] Virtual display exited with code ${code}`);
                    virtualDisplayProcess = null;
                });

                callback({ success: true });
            });

        } else if (process.platform === 'win32') {
            // Windows: use a PowerShell script to add a virtual display
            // This uses the built-in Windows display driver trick
            const ps = `
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Display {
    [DllImport("user32.dll")] public static extern bool EnumDisplayDevices(string lpDevice, uint iDevNum, ref DISPLAY_DEVICE lpDisplayDevice, uint dwFlags);
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)] public struct DISPLAY_DEVICE { public int cb; [MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)] public string DeviceName; [MarshalAs(UnmanagedType.ByValTStr, SizeConst=128)] public string DeviceString; public int StateFlags; [MarshalAs(UnmanagedType.ByValTStr, SizeConst=128)] public string DeviceID; [MarshalAs(UnmanagedType.ByValTStr, SizeConst=128)] public string DeviceKey; }
}
"@
Write-Host "Virtual display support on Windows requires IddSampleDriver or similar. Please install from the Download page."
`;
            console.log('[Agent] Windows virtual display: requires IddSampleDriver');
            callback({ success: false, message: 'Windows virtual display requires additional driver. See Download page for instructions.' });

        } else {
            // Linux: use Xvfb or xrandr
            exec('which Xvfb', (err) => {
                if (err) {
                    return callback({ success: false, message: 'Xvfb not found. Install with: sudo apt install xvfb' });
                }
                virtualDisplayProcess = spawn('Xvfb', [':99', '-screen', '0', '1920x1080x24']);
                virtualDisplayProcess.on('error', (e) => {
                    console.error('[Agent] Xvfb error:', e);
                    virtualDisplayProcess = null;
                });
                callback({ success: true });
            });
        }

    } else {
        // Disable virtual display
        if (virtualDisplayProcess) {
            virtualDisplayProcess.kill();
            virtualDisplayProcess = null;
        }
        callback({ success: true });
    }
}

// ─── WebSocket Server ─────────────────────────────────────────────────────────

const wss = new WebSocketServer({
    port: PORT,
    // Allow connections from any origin (the web dashboard)
    verifyClient: () => true,
});

console.log(`[Agent] ✅ DisplayExtend Agent v${AGENT_VERSION} running`);
console.log(`[Agent] 🔌 WebSocket server: ws://localhost:${PORT}`);
console.log(`[Agent] 💻 Platform: ${process.platform}`);
console.log(`[Agent] 🤖 robotjs: ${robot ? 'ready' : 'NOT AVAILABLE'}`);
console.log(`[Agent] Waiting for connections from the web dashboard...`);

wss.on('connection', (ws, req) => {
    const origin = req.headers.origin || 'unknown';
    console.log(`[Agent] 🟢 Client connected from: ${origin}`);

    // Send ready handshake
    ws.send(JSON.stringify({
        type: 'ready',
        version: AGENT_VERSION,
        platform: process.platform,
        robotAvailable: !!robot,
    }));

    ws.on('message', (raw) => {
        let message;
        try {
            message = JSON.parse(raw.toString());
        } catch (e) {
            console.error('[Agent] Invalid JSON message:', raw.toString().slice(0, 100));
            return;
        }

        if (message.type === 'simulate-input') {
            const result = simulateInput(message.payload);
            // Only send response for non-mousemove to avoid flooding
            if (message.payload?.type !== 'mousemove') {
                ws.send(JSON.stringify({ type: 'input-result', ...result }));
            }

        } else if (message.type === 'virtual-display:toggle') {
            toggleVirtualDisplay(message.enabled, (result) => {
                ws.send(JSON.stringify({ type: 'virtual-display:result', ...result }));
            });

        } else if (message.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));

        } else if (message.type === 'get-info') {
            ws.send(JSON.stringify({
                type: 'info',
                version: AGENT_VERSION,
                platform: process.platform,
                robotAvailable: !!robot,
                virtualDisplayActive: !!virtualDisplayProcess,
            }));
        }
    });

    ws.on('close', () => {
        console.log('[Agent] 🔴 Client disconnected');
    });

    ws.on('error', (err) => {
        console.error('[Agent] WebSocket error:', err.message);
    });
});

wss.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[Agent] ❌ Port ${PORT} is already in use. Another instance may be running.`);
        process.exit(1);
    } else {
        console.error('[Agent] Server error:', err);
    }
});

// ─── Cleanup ──────────────────────────────────────────────────────────────────

function cleanup() {
    console.log('[Agent] Shutting down...');
    if (virtualDisplayProcess) {
        virtualDisplayProcess.kill();
    }
    wss.close();
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (err) => {
    console.error('[Agent] Uncaught exception:', err);
    cleanup();
});
