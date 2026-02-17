// Popup script
const statusDiv = document.getElementById('status');
const instructionsP = document.getElementById('instructions');
const reconnectBtn = document.getElementById('reconnect');

function updateStatus() {
    chrome.runtime.sendMessage({ type: 'check-native-host' }, (response) => {
        if (response && response.available) {
            statusDiv.className = 'status connected';
            statusDiv.innerHTML = '<strong>✓ Connected</strong><br>Remote control is enabled';
            instructionsP.textContent = 'You can now use remote control features in the DisplayExtended dashboard.';
            reconnectBtn.style.display = 'none';
        } else {
            statusDiv.className = 'status disconnected';
            statusDiv.innerHTML = '<strong>✗ Not Connected</strong><br>Native host is not available';
            instructionsP.innerHTML = 'Please install the native host application. <a href="#" class="link" id="install-link">Installation Guide</a>';
            reconnectBtn.style.display = 'block';
        }
    });
}

reconnectBtn.addEventListener('click', () => {
    reconnectBtn.disabled = true;
    reconnectBtn.textContent = 'Connecting...';

    chrome.runtime.sendMessage({ type: 'connect-native-host' }, () => {
        setTimeout(() => {
            updateStatus();
            reconnectBtn.disabled = false;
            reconnectBtn.textContent = 'Reconnect Native Host';
        }, 1000);
    });
});

document.addEventListener('click', (e) => {
    if (e.target.id === 'install-link') {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://github.com/yourusername/displayextended#native-host-installation' });
    }
});

// Update status on load
updateStatus();

// Refresh status every 3 seconds
setInterval(updateStatus, 3000);
