# Mobarez DisplayExtended

Mobarez DisplayExtended is a multi-platform solution for extending screens and remote control across devices.

## Project Structure

This monorepo contains several components:

- **Web Dashboard** (`apps/web-dashboard`): The primary user interface for managing devices and viewing streams. Available at [displayextend.mm-codes.com](https://displayextend.mm-codes.com).
- **Desktop Application** (`apps/desktop`): An "all-in-one" host application built with Electron. It bundles the local agent and virtual display helper. **Recommended for Host machines.**
- **Local Agent** (`apps/agent`): A lightweight Node.js agent that handles input simulation and virtual displays. It is used by both the Desktop App and the Browser Extension.
- **Browser Extension** (`apps/browser-extension`): Enables remote control features directly from a web browser.
- **Native Host** (`apps/native-host`): A companion for the browser extension to enable system-level input.

## Getting Started

1.  Run `npm install` in the root directory.
2.  Run `npm run dev` to start the development environment (Dashboard + Desktop App).

## Building & Releasing

If you are experiencing 404 errors on the download page, please follow the [Release Guide](file:///Users/essam/Desktop/Mobarez-DisplayExtend/Mobarezdisplayextended/RELEASE_GUIDE.md) to create a GitHub release and upload the binaries.