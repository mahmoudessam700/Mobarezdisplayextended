# DisplayExtended Browser Extension

## Overview

The DisplayExtended Browser Extension enables **remote control functionality** when using the web dashboard in a browser. It bridges the gap between the web application and system-level input simulation.

## Architecture

```
Web Dashboard → Browser Extension → Native Host → robotjs → System Input
```

## Installation

### 1. Install the Browser Extension

#### Chrome/Edge (Developer Mode)

1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `apps/browser-extension` folder
5. Note the Extension ID (you'll need this for step 2)

#### Firefox (Developer Mode)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in the `apps/browser-extension` folder
4. The extension will be loaded temporarily

### 2. Install the Native Host

The native host is required for the extension to simulate input.

#### macOS/Linux

```bash
cd apps/native-host
npm install
npm run install-host
```

#### Windows

```bash
cd apps\native-host
npm install
npm run install-host
```

**Note:** On Windows, you may need to run as Administrator.

### 3. Update Extension ID

After installing the extension, you need to update the native host manifest with the actual extension ID:

1. Copy the Extension ID from Chrome/Edge
2. Edit the manifest file:
   - **macOS**: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.displayextended.nativehost.json`
   - **Windows**: Check the registry or the manifest file in `apps/native-host/`
   - **Linux**: `~/.config/google-chrome/NativeMessagingHosts/com.displayextended.nativehost.json`
3. Replace `EXTENSION_ID_HERE` with your actual extension ID
4. Reload the extension

### 4. Verify Installation

1. Click the extension icon in your browser
2. The popup should show "✓ Connected" if everything is working
3. If not connected, click "Reconnect Native Host"

## Usage

### In the Web Dashboard

1. Open the DisplayExtended dashboard in your browser
2. Navigate to the Display page (`/display`)
3. If the extension is installed and working, you'll see remote control features enabled
4. Connect to a host and enable remote control

### Features Enabled

- ✅ Mouse movement control
- ✅ Mouse click control
- ✅ Keyboard input control
- ✅ Works on localhost and production
- ✅ Cross-platform (Windows & macOS)

## Troubleshooting

### Extension shows "Not Connected"

**Possible causes:**
1. Native host not installed
2. Extension ID not updated in manifest
3. Native host crashed

**Solutions:**
1. Run `npm run install-host` in `apps/native-host`
2. Update the extension ID in the manifest
3. Check browser console for errors
4. Restart the browser

### Input simulation not working

**Possible causes:**
1. Permissions not granted (macOS)
2. Native host not running
3. robotjs not installed

**Solutions:**
- **macOS**: Grant Accessibility permissions in System Preferences
- **Windows**: Run browser as Administrator
- Reinstall native host: `cd apps/native-host && npm install`

### Extension not detected in dashboard

**Possible causes:**
1. Extension not loaded
2. Content script not injected
3. Wrong URL

**Solutions:**
1. Reload the extension
2. Refresh the dashboard page
3. Ensure you're on `localhost:5173` or `displayextend.mm-codes.com`

## Development

### Building the Extension

The extension is already in source form and doesn't require building. Just load it directly in developer mode.

### Testing

1. Load the extension in developer mode
2. Install the native host
3. Open the dashboard
4. Check browser console for logs
5. Test remote control functionality

### Debugging

**Extension logs:**
- Open extension popup
- Right-click → Inspect
- Check console for extension logs

**Native host logs:**
- Native host logs to stderr
- Check terminal output when running manually

**Content script logs:**
- Open dashboard page
- Open browser DevTools
- Check console for `[DisplayExtended Extension]` logs

## Publishing (Future)

To publish to official stores:

1. **Chrome Web Store:**
   - Create developer account ($5 fee)
   - Package extension as .zip
   - Upload and submit for review

2. **Firefox Add-ons:**
   - Create developer account (free)
   - Package extension as .zip
   - Upload and submit for review

## Security

- Extension requests minimal permissions
- Native messaging is sandboxed
- Input validation on all messages
- No external network requests

## License

Same as main DisplayExtended project
