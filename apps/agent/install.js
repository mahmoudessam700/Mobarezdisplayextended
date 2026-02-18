#!/usr/bin/env node

/**
 * DisplayExtend Agent Installer
 * 
 * Registers the agent as a system service so it auto-starts on login.
 * 
 * Usage:
 *   node install.js          — Install (auto-start on login)
 *   node install.js --remove — Uninstall
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const platform = process.platform;
const agentPath = path.join(__dirname, 'index.js');
const nodePath = process.execPath; // path to the current node binary
const isRemove = process.argv.includes('--remove');

console.log(`\n🚀 DisplayExtend Agent Installer\n`);

// ─── macOS: LaunchAgent plist ─────────────────────────────────────────────────

function installMac() {
    const plistDir = path.join(os.homedir(), 'Library', 'LaunchAgents');
    const plistPath = path.join(plistDir, 'com.displayextend.agent.plist');

    if (isRemove) {
        try {
            execSync(`launchctl unload "${plistPath}" 2>/dev/null || true`);
            if (fs.existsSync(plistPath)) fs.unlinkSync(plistPath);
            console.log('✅ Agent removed from login items (macOS)');
        } catch (e) {
            console.error('Failed to remove:', e.message);
        }
        return;
    }

    if (!fs.existsSync(plistDir)) fs.mkdirSync(plistDir, { recursive: true });

    const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.displayextend.agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>${nodePath}</string>
        <string>${agentPath}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>${os.homedir()}/Library/Logs/displayextend-agent.log</string>
    <key>StandardErrorPath</key>
    <string>${os.homedir()}/Library/Logs/displayextend-agent-error.log</string>
</dict>
</plist>`;

    fs.writeFileSync(plistPath, plist);

    try {
        execSync(`launchctl unload "${plistPath}" 2>/dev/null || true`);
        execSync(`launchctl load "${plistPath}"`);
        console.log('✅ Agent installed and started (macOS LaunchAgent)');
        console.log(`   Logs: ~/Library/Logs/displayextend-agent.log`);
    } catch (e) {
        console.error('Failed to load LaunchAgent:', e.message);
        console.log('   You can start it manually: node', agentPath);
    }
}

// ─── Windows: Registry Run key ────────────────────────────────────────────────

function installWindows() {
    const regKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';
    const valueName = 'DisplayExtendAgent';
    const command = `"${nodePath}" "${agentPath}"`;

    if (isRemove) {
        try {
            execSync(`reg delete "${regKey}" /v "${valueName}" /f`, { stdio: 'pipe' });
            console.log('✅ Agent removed from startup (Windows Registry)');
        } catch (e) {
            console.log('Agent was not in registry (already removed)');
        }
        return;
    }

    try {
        execSync(`reg add "${regKey}" /v "${valueName}" /d "${command}" /f`, { stdio: 'inherit' });
        console.log('✅ Agent added to Windows startup (Registry)');
        console.log('   It will auto-start on next login.');
        console.log('   Start now: node', agentPath);
    } catch (e) {
        console.error('Failed to add to registry:', e.message);
        console.log('   You can start it manually: node', agentPath);
    }
}

// ─── Linux: systemd user service ─────────────────────────────────────────────

function installLinux() {
    const serviceDir = path.join(os.homedir(), '.config', 'systemd', 'user');
    const servicePath = path.join(serviceDir, 'displayextend-agent.service');

    if (isRemove) {
        try {
            execSync(`systemctl --user disable --now displayextend-agent 2>/dev/null || true`);
            if (fs.existsSync(servicePath)) fs.unlinkSync(servicePath);
            console.log('✅ Agent removed (Linux systemd)');
        } catch (e) {
            console.error('Failed to remove:', e.message);
        }
        return;
    }

    if (!fs.existsSync(serviceDir)) fs.mkdirSync(serviceDir, { recursive: true });

    const service = `[Unit]
Description=DisplayExtend Local Agent
After=network.target

[Service]
ExecStart=${nodePath} ${agentPath}
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
`;

    fs.writeFileSync(servicePath, service);

    try {
        execSync('systemctl --user daemon-reload');
        execSync('systemctl --user enable --now displayextend-agent');
        console.log('✅ Agent installed and started (Linux systemd)');
    } catch (e) {
        console.error('Failed to enable systemd service:', e.message);
        console.log('   You can start it manually: node', agentPath);
    }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

if (platform === 'darwin') {
    installMac();
} else if (platform === 'win32') {
    installWindows();
} else {
    installLinux();
}

console.log('\nDone! The agent will be available at ws://localhost:7822\n');
