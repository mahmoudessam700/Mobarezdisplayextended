import Cocoa

/**
 * InputManager
 * 
 * Captures native macOS events (keyboard, mouse) and prepares them
 * to be sent over the WebRTC Data Channel.
 */
protocol InputManagerDelegate: AnyObject {
    func inputManager(_ manager: InputManager, didCaptureInput data: Data)
}

class InputManager {
    weak var delegate: InputManagerDelegate?
    private var eventMonitor: Any?
    
    func startCapturing(in view: NSView) {
        print("[INPUT] Starting native event capture...")
        
        eventMonitor = NSEvent.addLocalMonitorForEvents(matching: [.mouseMoved, .leftMouseDown, .leftMouseUp, .keyDown, .scrollWheel]) { [weak self] event in
            self?.processEvent(event, in: view)
            return event
        }
    }
    
    private func processEvent(_ event: NSEvent, in view: NSView) {
        let location = view.convert(event.locationInWindow, from: nil)
        let x = location.x / view.bounds.width
        let y = 1.0 - (location.y / view.bounds.height)
        
        var payload: [String: Any] = [:]
        
        switch event.type {
        case .mouseMoved:
            payload = ["type": "mousemove", "x": x, "y": y]
        case .leftMouseDown:
            payload = ["type": "mousedown", "button": 0, "x": x, "y": y]
        case .leftMouseUp:
            payload = ["type": "mouseup", "button": 0, "x": x, "y": y]
        case .scrollWheel:
            payload = ["type": "scroll", "deltaX": event.scrollingDeltaX, "deltaY": event.scrollingDeltaY]
        case .keyDown:
            payload = ["type": "keydown", "key": event.charactersIgnoringModifiers ?? ""]
        default:
            return
        }
        
        sendInput(payload: payload)
    }
    
    private func sendInput(payload: [String: Any]) {
        let message: [String: Any] = [
            "type": "simulate-input",
            "payload": payload
        ]
        
        if let data = try? JSONSerialization.data(withJSONObject: message) {
            delegate?.inputManager(self, didCaptureInput: data)
        }
    }
}
