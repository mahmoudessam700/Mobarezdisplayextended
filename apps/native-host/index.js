#!/usr/bin/env node

/**
 * Native Messaging Host for DisplayExtended Browser Extension
 * 
 * This application receives messages from the browser extension via stdin
 * and simulates input using robotjs.
 */

const robot = require('robotjs');

// Native messaging protocol: messages are prefixed with 4-byte length
function getMessage() {
    return new Promise((resolve) => {
        const lengthBuffer = Buffer.alloc(4);
        process.stdin.read(4, lengthBuffer);

        process.stdin.once('readable', () => {
            const chunk = process.stdin.read(4);
            if (!chunk) {
                resolve(null);
                return;
            }

            const length = chunk.readUInt32LE(0);
            const messageBuffer = Buffer.alloc(length);

            let bytesRead = 0;
            while (bytesRead < length) {
                const data = process.stdin.read(length - bytesRead);
                if (!data) break;
                data.copy(messageBuffer, bytesRead);
                bytesRead += data.length;
            }

            try {
                const message = JSON.parse(messageBuffer.toString('utf8'));
                resolve(message);
            } catch (error) {
                logError('Failed to parse message:', error);
                resolve(null);
            }
        });
    });
}

function sendMessage(message) {
    const buffer = Buffer.from(JSON.stringify(message), 'utf8');
    const header = Buffer.alloc(4);
    header.writeUInt32LE(buffer.length, 0);

    process.stdout.write(header);
    process.stdout.write(buffer);
}

function logError(...args) {
    // Log to stderr (won't interfere with native messaging)
    console.error('[Native Host]', ...args);
}

function logInfo(...args) {
    console.error('[Native Host]', ...args);
}

// Handle input simulation
function simulateInput(data) {
    try {
        const screenSize = robot.getScreenSize();
        const { width, height } = screenSize;

        if (data.type === 'mousemove') {
            const absX = Math.round(data.x * width);
            const absY = Math.round(data.y * height);
            robot.moveMouse(absX, absY);
        } else if (data.type === 'mousedown') {
            const absX = data.x !== undefined ? Math.round(data.x * width) : robot.getMousePos().x;
            const absY = data.y !== undefined ? Math.round(data.y * height) : robot.getMousePos().y;
            robot.moveMouse(absX, absY);
            robot.mouseToggle('down');
        } else if (data.type === 'mouseup') {
            const absX = data.x !== undefined ? Math.round(data.x * width) : robot.getMousePos().x;
            const absY = data.y !== undefined ? Math.round(data.y * height) : robot.getMousePos().y;
            robot.moveMouse(absX, absY);
            robot.mouseToggle('up');
        } else if (data.type === 'keydown') {
            const key = data.key;

            // Build modifier array
            const modifiers = [];
            if (data.modifiers?.shift) modifiers.push('shift');
            if (data.modifiers?.ctrl || data.modifiers?.control) modifiers.push('control');
            if (data.modifiers?.alt) modifiers.push('alt');
            if (data.modifiers?.meta) modifiers.push('command');

            // Map special keys
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
                robot.typeString(key);
            } else {
                robot.keyTap(robotKey);
            }
        }

        return { success: true };
    } catch (error) {
        logError('Input simulation error:', error.message);
        return { success: false, error: error.message };
    }
}

// Main message loop
async function main() {
    logInfo('Native host started');

    // Send ready message
    sendMessage({ type: 'ready', version: '1.0.0' });

    // Read messages from stdin
    while (true) {
        const message = await getMessage();

        if (!message) {
            logInfo('Connection closed');
            break;
        }

        logInfo('Received message:', message.type);

        if (message.type === 'input') {
            const result = simulateInput(message.payload);
            sendMessage({ type: 'response', success: result.success, error: result.error });
        } else if (message.type === 'ping') {
            sendMessage({ type: 'pong' });
        } else {
            logError('Unknown message type:', message.type);
        }
    }

    logInfo('Native host exiting');
    process.exit(0);
}

// Handle errors
process.on('uncaughtException', (error) => {
    logError('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logError('Unhandled rejection:', error);
    process.exit(1);
});

// Start the host
main().catch((error) => {
    logError('Fatal error:', error);
    process.exit(1);
});
