#!/usr/bin/env node

/**
 * Installation script for native messaging host
 * Registers the host with Chrome/Edge/Firefox
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOST_NAME = 'com.displayextended.nativehost';
const platform = process.platform;

// Get the absolute path to the native host
const hostPath = path.join(__dirname, 'index.js');

// Make the host executable
if (platform !== 'win32') {
    try {
        fs.chmodSync(hostPath, '755');
        console.log('✓ Made host executable');
    } catch (error) {
        console.error('Failed to make host executable:', error.message);
    }
}

// Create manifest for native messaging
const manifest = {
    name: HOST_NAME,
    description: 'DisplayExtended Native Messaging Host',
    path: hostPath,
    type: 'stdio',
    allowed_origins: [
        `chrome-extension://EXTENSION_ID_HERE/`
    ]
};

// Platform-specific installation
function installChrome() {
    let manifestDir;

    if (platform === 'darwin') {
        // macOS
        manifestDir = path.join(os.homedir(), 'Library/Application Support/Google/Chrome/NativeMessagingHosts');
    } else if (platform === 'win32') {
        // Windows - use registry
        const manifestPath = path.join(__dirname, `${HOST_NAME}.json`);
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

        const regKey = `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`;
        try {
            execSync(`reg add "${regKey}" /ve /d "${manifestPath}" /f`, { stdio: 'inherit' });
            console.log('✓ Registered with Chrome (Windows Registry)');
            return;
        } catch (error) {
            console.error('Failed to register with Chrome:', error.message);
            return;
        }
    } else {
        // Linux
        manifestDir = path.join(os.homedir(), '.config/google-chrome/NativeMessagingHosts');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(manifestDir)) {
        fs.mkdirSync(manifestDir, { recursive: true });
    }

    // Write manifest
    const manifestPath = path.join(manifestDir, `${HOST_NAME}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✓ Installed Chrome manifest: ${manifestPath}`);
}

function installFirefox() {
    let manifestDir;

    if (platform === 'darwin') {
        manifestDir = path.join(os.homedir(), 'Library/Application Support/Mozilla/NativeMessagingHosts');
    } else if (platform === 'win32') {
        // Windows - use registry
        const manifestPath = path.join(__dirname, `${HOST_NAME}_firefox.json`);
        const firefoxManifest = { ...manifest };
        firefoxManifest.allowed_extensions = ['displayextended@mm-codes.com'];
        delete firefoxManifest.allowed_origins;

        fs.writeFileSync(manifestPath, JSON.stringify(firefoxManifest, null, 2));

        const regKey = `HKCU\\Software\\Mozilla\\NativeMessagingHosts\\${HOST_NAME}`;
        try {
            execSync(`reg add "${regKey}" /ve /d "${manifestPath}" /f`, { stdio: 'inherit' });
            console.log('✓ Registered with Firefox (Windows Registry)');
            return;
        } catch (error) {
            console.error('Failed to register with Firefox:', error.message);
            return;
        }
    } else {
        manifestDir = path.join(os.homedir(), '.mozilla/native-messaging-hosts');
    }

    if (!fs.existsSync(manifestDir)) {
        fs.mkdirSync(manifestDir, { recursive: true });
    }

    const firefoxManifest = { ...manifest };
    firefoxManifest.allowed_extensions = ['displayextended@mm-codes.com'];
    delete firefoxManifest.allowed_origins;

    const manifestPath = path.join(manifestDir, `${HOST_NAME}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(firefoxManifest, null, 2));
    console.log(`✓ Installed Firefox manifest: ${manifestPath}`);
}

// Main installation
console.log('Installing DisplayExtended Native Messaging Host...\n');

try {
    installChrome();
    installFirefox();

    console.log('\n✓ Installation complete!');
    console.log('\nNext steps:');
    console.log('1. Install the browser extension');
    console.log('2. Update the extension ID in the manifest files');
    console.log('3. Reload the extension');

} catch (error) {
    console.error('\n✗ Installation failed:', error.message);
    process.exit(1);
}
