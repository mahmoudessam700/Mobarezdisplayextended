#!/bin/bash
# ============================================================
# Mobarez DisplayExtended — Start Script
# ============================================================
# Usage:
#   ./start.sh              → Localhost mode (signaling + dashboard dev server)
#   ./start.sh --prod       → Online/Production mode (build + serve on port 4000)
#   ./start.sh --desktop    → Desktop mode (signaling + dashboard + Electron)
# ============================================================

set -e
cd "$(dirname "$0")"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

MODE="${1:---dev}"

case "$MODE" in
    --prod|--production|--online)
        echo "🌐 Starting in PRODUCTION / ONLINE mode..."
        echo "   Building web dashboard, then starting signaling server on port ${PORT:-4000}..."
        npm run start:prod
        ;;
    --desktop|--electron)
        echo "🖥️  Starting in DESKTOP mode..."
        echo "   Launching signaling server + dashboard + Electron..."
        npm run start:desktop
        ;;
    --dev|*)
        echo "🔧 Starting in LOCALHOST / DEV mode..."
        echo "   Dashboard: http://localhost:5173"
        echo "   Signaling: http://localhost:4000"
        npm run start:all
        ;;
esac
