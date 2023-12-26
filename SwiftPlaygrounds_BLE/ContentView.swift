import SwiftUI

struct ContentView: View {

    @StateObject var viewModel = ViewModel()
    @State var selection = 1

    var body: some View {
        TabView(selection: $selection) {
            PagePanelView(viewModel: viewModel)
                .tabItem {
                    Label("PANEL", systemImage: "1.circle").labelStyle(TitleOnlyLabelStyle())
                }
                .tag(1)
            PageAdjustView(viewModel: viewModel)
                .tabItem {
                    Label("ADJUST", systemImage: "2.circle").labelStyle(TitleOnlyLabelStyle())
                }
                .tag(2)
        }
        .onChange(of: selection) { selection in
            if selection == 2 {
                viewModel.sendCommand(cmd: "get angles_init")
            }    
        }
    }

}
