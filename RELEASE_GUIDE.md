# DisplayExtended Release Guide

This guide explains how to build the application binaries and create a GitHub release so that the download links in the dashboard work correctly.

## Prerequisites

- Node.js installed.
- `electron-builder` (installed automatically via `npm install`).
- A macOS machine (required to build the `.dmg`).

## Step 1: Build the Desktop Application

1.  Navigate to the project root:
    ```bash
    cd /Users/essam/Desktop/Mobarez-DisplayExtend/Mobarezdisplayextended
    ```
2.  Install all dependencies:
    ```bash
    npm install
    ```
3.  Navigate to the desktop app folder:
    ```bash
    cd apps/desktop
    ```
4.  Run the build command for macOS:
    ```bash
    # This will generate a .dmg file in apps/desktop/dist
    npx electron-builder build --mac
    ```

> [!NOTE]
> For Windows, run `npx electron-builder build --win`.

## Step 2: Create a GitHub Release

1.  Go to your GitHub repository: [mahmoudessam700/Mobarezdisplayextended](https://github.com/mahmoudessam700/Mobarezdisplayextended).
2.  Click on **Releases** in the right sidebar.
3.  Click **Draft a new release**.
4.  Set the **Tag version** to `v1.0.0`.
5.  Set the **Release title** to `Mobarez DisplayExtended v1.0.0`.
6.  In the **Attach binaries** section, drag and drop the files from:
    - `apps/desktop/dist/DisplayExtended.dmg` (macOS)
    - `apps/desktop/dist/DisplayExtended-Setup.exe` (Windows)
7.  Click **Publish release**.

## Step 3: Verify Links

Once the release is published, the following links in your web dashboard will start working:

- macOS: `https://github.com/mahmoudessam700/Mobarezdisplayextended/releases/download/v1.0.0/DisplayExtended.dmg`
- Windows: `https://github.com/mahmoudessam700/Mobarezdisplayextended/releases/download/v1.0.0/DisplayExtended-Setup.exe`
