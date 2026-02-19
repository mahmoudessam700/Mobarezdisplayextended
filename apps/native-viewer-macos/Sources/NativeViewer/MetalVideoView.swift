import MetalKit

/**
 * MetalVideoView
 * 
 * High-performance view that renders raw video frames using Metal.
 * This is where we get the AnyDesk-like performance.
 */
class MetalVideoView: MTKView {
    private var commandQueue: MTLCommandQueue?
    
    override init(frame frameRect: CGRect, device: MTLDevice?) {
        super.init(frame: frameRect, device: device ?? MTLCreateSystemDefaultDevice())
        self.commandQueue = self.device?.makeCommandQueue()
        self.enableSetNeedsDisplay = true
        self.framebufferOnly = true
    }
    
    required init(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    /**
     * Called when a new video frame arrives from WebRTC.
     * In a real implementation, this would update a Metal texture.
     */
    func renderFrame(_ frame: Any) {
        // 1. Convert WebRTC frame (CVPixelBuffer) to Metal Texture
        // 2. Trigger redraw
        setNeedsDisplay(self.bounds)
    }
    
    override func draw(_ rect: CGRect) {
        guard let drawable = currentDrawable,
              let descriptor = currentRenderPassDescriptor else { return }
        
        let commandBuffer = commandQueue?.makeCommandBuffer()
        let commandEncoder = commandBuffer?.makeRenderCommandEncoder(descriptor: descriptor)
        
        // --- RENDERING LOGIC ---
        // Draw the frame texture onto the drawable
        
        commandEncoder?.endEncoding()
        commandBuffer?.present(drawable)
        commandBuffer?.commit()
    }
}
