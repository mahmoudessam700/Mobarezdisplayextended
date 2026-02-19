// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "NativeViewer",
    platforms: [
        .macOS(.v11)
    ],
    products: [
        .executable(name: "NativeViewer", targets: ["NativeViewer"]),
    ],
    dependencies: [
        // Dependencies like GoogleWebRTC can be added here
        // .package(url: "https://github.com/stasel/WebRTC.git", from: "100.0.0"),
    ],
    targets: [
        .executableTarget(
            name: "NativeViewer",
            dependencies: [],
            path: "Sources/NativeViewer"
        ),
        .testTarget(
            name: "NativeViewerTests",
            dependencies: ["NativeViewer"],
            path: "Tests/NativeViewerTests"
        ),
    ]
)
