# Mobarez DisplayExtended Native Migration Roadmap

This document outlines the technical path to convert the existing WebRTC web-based viewer into a high-performance, "Proprietary Native" architecture.

## 1. Architectural Shift

The current architecture relies on browser-level abstractions:
`Network (WebRTC) -> Browser Video Decode -> DOM Rendering`

The native architecture will target direct hardware access:
`Network (Custom UDP/Native WebRTC) -> Hardware Decoder (VT/DirectX) -> Metal/DirectX Renderer`

## 2. Component Replacements

| Component | Web Implementation | Native Alternative (Mac/Win) |
| :--- | :--- | :--- |
| **Signaling** | `peerjs` (JS library) | Native WebSocket client + PeerJS protocol parser |
| **WebRTC Stack** | Chromium / Browser | `libwebrtc` (Google's native C++ library) |
| **Video Decoding** | `<video>` tag | `VideoToolbox` (Mac) / `Media Foundation` (Win) |
| **Rendering** | CSS/HTML5 Canvas | **Metal** (Mac) / **DirectX 11/12** (Win) |
| **Event Loop** | JS Event Loop | Native Main Thread + Grand Central Dispatch |

## 3. Native macOS Implementation (Phase 1)

### Key Files & Modules
- `SignalingService.swift`: Handles PeerJS handshakes.
- `WebRTCClient.swift`: Wraps the native GoogleWebRTC library.
- `MetalVideoView.swift`: A custom `MTKView` for low-latency frame display.
- `InputManager.swift`: Captures keyboard/mouse events and sends them over the RTC Data Channel.

## 4. Performance Targets
- **End-to-end Latency**: < 20ms (local network).
- **Frame Rate**: Unlocked (match display refresh rate 60/120Hz).
- **CPU Usage**: < 5% during active streaming.

## 5. Next Steps
1.  Initialize the Swift package.
2.  Implement the WebSocket signaling handshake.
3.  Display a test stream using the Metal renderer.
