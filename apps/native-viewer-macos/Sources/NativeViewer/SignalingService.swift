import Foundation

/**
 * SignalingService
 * 
 * Handles the WebSocket connection to the PeerJS signaling server.
 * This is the "brain" that negotiates WebRTC connections natively.
 */
protocol SignalingDelegate: AnyObject {
    func signalingDidConnect(_ service: SignalingService, myId: String)
    func signalingDidReceiveOffer(_ service: SignalingService, offer: [String: Any], peerId: String)
    func signalingDidReceiveCandidate(_ service: SignalingService, candidate: [String: Any], peerId: String)
}

class SignalingService: NSObject, URLSessionWebSocketDelegate {
    private var webSocket: URLSessionWebSocketTask?
    private let peerId: String
    weak var delegate: SignalingDelegate?
    
    init(peerId: String) {
        self.peerId = peerId
        super.init()
    }
    
    func connect() {
        // Default PeerJS cloud server URL format:
        // ws://0.peerjs.com:9000/peerjs?key=peerjs&id={ID}&token={TOKEN}
        let urlString = "wss://0.peerjs.com/peerjs?key=peerjs&id=\(peerId)&token=native-client"
        guard let url = URL(string: urlString) else { return }
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: OperationQueue.main)
        webSocket = session.webSocketTask(with: url)
        webSocket?.resume()
        
        receiveMessage()
    }
    
    private func receiveMessage() {
        webSocket?.receive { [weak self] result in
            switch result {
            case .success(let message):
                switch message {
                case .string(let text):
                    self?.handleIncomingText(text)
                default:
                    break
                }
                self?.receiveMessage()
            case .failure(let error):
                print("[SIGNaling] Error: \(error.localizedDescription)")
            }
        }
    }
    
    private func handleIncomingText(_ text: String) {
        guard let data = text.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let type = json["type"] as? String else { return }
        
        print("[SIGNALING] Received: \(type)")
        
        switch type {
        case "OPEN":
            delegate?.signalingDidConnect(self, myId: peerId)
        case "OFFER":
            if let peer = json["src"] as? String, let payload = json["payload"] as? [String: Any] {
                delegate?.signalingDidReceiveOffer(self, offer: payload, peerId: peer)
            }
        case "CANDIDATE":
            if let peer = json["src"] as? String, let payload = json["payload"] as? [String: Any] {
                delegate?.signalingDidReceiveCandidate(self, candidate: payload, peerId: peer)
            }
        default:
            break
        }
    }
    
    func sendMessage(type: String, dest: String, payload: [String: Any]) {
        let msg: [String: Any] = [
            "type": type,
            "src": peerId,
            "dst": dest,
            "payload": payload
        ]
        
        if let data = try? JSONSerialization.data(withJSONObject: msg),
           let text = String(data: data, encoding: .utf8) {
            webSocket?.send(.string(text)) { error in
                if let error = error {
                    print("[SIGNALING] Send Error: \(error)")
                }
            }
        }
    }
}
