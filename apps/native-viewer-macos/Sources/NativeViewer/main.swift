import Foundation

/**
 * Mobarez DisplayExtended Native Viewer (macOS)
 */

class App: SignalingDelegate, InputManagerDelegate {
    let signaling: SignalingService
    let webRTC: WebRTCManager
    let input: InputManager
    
    init() {
        let testId = "native-mac-\(Int.random(in: 1000...9999))"
        self.signaling = SignalingService(peerId: testId)
        self.webRTC = WebRTCManager(signaling: signaling)
        self.input = InputManager()
        
        self.signaling.delegate = self
        self.input.delegate = self
    }
    
    func start() {
        print("🚀 Mobarez DisplayExtended Native Viewer Starting...")
        signaling.connect()
    }
    
    // MARK: - InputManagerDelegate
    
    func inputManager(_ manager: InputManager, didCaptureInput data: Data) {
        // Send the input data over the WebRTC data channel
        webRTC.sendData(data)
    }
    
    // MARK: - SignalingDelegate
    
    func signalingDidConnect(_ service: SignalingService, myId: String) {
        print("✅ Connected to signaling server with ID: \(myId)")
        print("Waiting for host to connect...")
    }
    
    func signalingDidReceiveOffer(_ service: SignalingService, offer: [String: Any], peerId: String) {
        print("📥 Received offer from \(peerId)")
        if let sdp = offer["sdp"] as? String {
            webRTC.handleRemoteOffer(sdp, peerId: peerId)
        }
    }
    
    func signalingDidReceiveCandidate(_ service: SignalingService, candidate: [String: Any], peerId: String) {
        print("📥 Received ICE candidate from \(peerId)")
        webRTC.handleRemoteCandidate(candidate, peerId: peerId)
    }
}

let app = App()
app.start()

// Keep the executable alive
RunLoop.main.run()
