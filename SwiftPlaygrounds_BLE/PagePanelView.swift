import SwiftUI

struct PagePanelView: View {
    
    @ObservedObject var viewModel: ViewModel
    
    var body: some View {

        VStack(spacing: 40) {

            if viewModel.isScanning {
                Button("Scanning...") {
                    viewModel.cancel()
                }.font(.system(size: 20, weight: .black, design: .default))
            } else {
                if let name = viewModel.peripheral?.name {
                    HStack{
                        Button(action: { viewModel.disconnect() }) {
                            Image(systemName: "xmark.circle.fill")
                        }
                        Text(name)
                    }.font(.system(size: 20, weight: .black, design: .default))
                } else {
                    Button("Connect") {
                        viewModel.connect()
                    }
                    .font(.system(size: 20, weight: .black, design: .default))
                }
            }

            VStack{

                HStack{
                    Button("↖️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "forward_left") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                    Button("⬆️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "forward") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                    Button("↗️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "forward_right") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                }

                HStack{
                    Button("↪️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "turn_left") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                    Button("◻️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "stop") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                    Button("↩️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "turn_right") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                }

                HStack{
                    Button("↙️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "backward_left") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                    Button("⬇️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "backward") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                    Button("↘️"){}
                        .onTouchDownGesture { viewModel.sendCommand(cmd: "backward_right") }
                        .onTouchUpGesture { viewModel.sendCommand(cmd: "stop") }
                }

            }
            .font(.system(size: 80, weight: .black, design: .default))
     
        }

    }

}

extension View {
    func onTouchDownGesture(callback: @escaping () -> Void) -> some View {
        modifier(OnTouchDownGestureModifier(callback: callback))
    }
    func onTouchUpGesture(callback: @escaping () -> Void) -> some View {
        modifier(OnTouchUpGestureModifier(callback: callback))
    }
}

private struct OnTouchDownGestureModifier: ViewModifier {
    @State private var tapped = false
    let callback: () -> Void
    
    func body(content: Content) -> some View {
        content
            .simultaneousGesture(DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !self.tapped {
                        self.tapped = true
                        self.callback()
                    }
                }
                .onEnded { _ in
                    self.tapped = false
                })
    }
}

private struct OnTouchUpGestureModifier: ViewModifier {
    @State private var tapped = false
    let callback: () -> Void
    
    func body(content: Content) -> some View {
        content
            .simultaneousGesture(DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !self.tapped {
                        self.tapped = true
                    }
                }
                .onEnded { _ in
                    self.tapped = false
                    self.callback()
                })
    }
}
