import Combine
import CoreBluetooth
import AsyncBluetooth
import Foundation

let uart_service_uuid = CBUUID(string: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
let rx_char_uuid = CBUUID(string: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E")
let tx_char_uuid = CBUUID(string: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E")

@MainActor
class ViewModel: ObservableObject {

    @Published var isScanning = false
    @Published var peripheral: Peripheral?
    @Published var left_leg_ini:Double = 90
    @Published var right_leg_ini:Double = 90
    @Published var left_foot_ini:Double = 90
    @Published var right_foot_ini:Double = 90
    
    private let centralManager = CentralManager()
    //private var rx_characteristic: Characteristic?
    private var tx_characteristic: Characteristic?
    private var cancellables: [AnyCancellable] = []
    
    func connect() {
        Task {
            do {
                self.isScanning = true
                
                try await centralManager.waitUntilReady()
                let scanDataStream = try await centralManager.scanForPeripherals(withServices: nil) 
                for await scanData in scanDataStream {
                    let pname = scanData.peripheral.name ?? "Unknown"
                    if pname.hasPrefix("BBC micro:bit") || pname.hasPrefix("mpy-uart") {
                        do {
                            self.peripheral = scanData.peripheral
                            try await centralManager.connect(scanData.peripheral, options: nil)
                            print("Connected", pname)
                            try await scanData.peripheral.discoverServices([uart_service_uuid])
                            guard let service = scanData.peripheral.discoveredServices?.first else {
                                throw PeripheralError.serviceNotFound
                            }
                            print("Discovered a service", uart_service_uuid)
                            
                            try await scanData.peripheral.discoverCharacteristics([tx_char_uuid], for: service)
                            guard let characteristic = service.discoveredCharacteristics?.first else {
                                throw PeripheralError.characteristicNotFound
                            }
                            print("Discovered a characteristic: tx", tx_char_uuid)
                            self.tx_characteristic = characteristic
                            
                            //try await scanData.peripheral.discoverCharacteristics([rx_char_uuid], for: service)
                            //guard let characteristic = service.discoveredCharacteristics?.first else {
                            //    throw PeripheralError.characteristicNotFound
                            //}
                            //print("Discovered a characteristic: rx", rx_char_uuid)
                            //self.rx_characteristic = characteristic
                            
                            peripheral?.characteristicValueUpdatedPublisher
                                .filter { $0.uuid == rx_char_uuid }
                                .map { try? $0.parsedValue() as String? }
                                .sink { value in
                                    self.checkCommand(cmd: (value ?? ""))
                                }
                                .store(in: &cancellables)
                            try await peripheral?.setNotifyValue(true, forCharacteristicWithCBUUID: rx_char_uuid, ofServiceWithCBUUID: uart_service_uuid)
                            
                            print("Ready!")
                            
                            break
                        } catch {
                            print(error)
                            self.peripheral = nil
                            try await centralManager.cancelPeripheralConnection(scanData.peripheral)
                        }
                    }
                    
                }
            } catch {
                print(error)
            }
            
            await centralManager.stopScan()
            self.isScanning = false
        }
    }
    
    func cancel() {
        Task {
            if let peripheral = self.peripheral {
                self.peripheral = nil
                try await centralManager.cancelPeripheralConnection(peripheral)
            }
            await centralManager.stopScan()
            self.isScanning = false
        }
    }
    
    func disconnect() {
        Task {
            do {
                if let peripheral = peripheral {
                    self.peripheral = nil
                    try await centralManager.cancelPeripheralConnection(peripheral)
                }
            } catch {
                print(error)
            }
        }
    }
    
    func sendCommand(cmd: String) {
        Task {
            do {
                if let characteristic = tx_characteristic {
                    let cmdnl = cmd + "\n"
                    let data = [UInt8](cmdnl.utf8)
                    printUartData(itm: "sent", data: cmdnl)
                    try await peripheral?.writeValue(Data(data), for: characteristic, type: .withoutResponse)
                }
            } catch {
                print(error)
            }
        }
    }
    
    func checkCommand(cmd: String) {
        printUartData(itm: "received", data: cmd)
        var tmp = cmd.replacingOccurrences(of: "\r", with: "")
        tmp = tmp.replacingOccurrences(of: "\n", with: "")
        let arr:[String] = tmp.components(separatedBy: " ")
 
        if arr.count == 2 {
            if arr[0] == "ri" {
                let para:[String] = arr[1].components(separatedBy: ",")
                if para.count == 4 {
                    self.left_leg_ini = 180 - Double(para[0])!
                    self.left_foot_ini = Double(para[1])!
                    self.right_leg_ini = 180 - Double(para[2])!
                    self.right_foot_ini = Double(para[3])!
                }
            }
        }
          
    }

    func setAnglesInit() {

        var cmd: String = "si "
        cmd += String(180 - Int(self.left_leg_ini) )
        cmd += "," + String(Int(self.left_foot_ini) )
        cmd += "," + String(180 - Int(self.right_leg_ini) )
        cmd += "," + String(Int(self.right_foot_ini) )
        self.sendCommand(cmd: cmd)

    }
    
    func printUartData(itm :String, data :String) {
        var tmp = data.replacingOccurrences(of: "\r", with: "\\r")
        tmp = tmp.replacingOccurrences(of: "\n", with: "\\n")
        print(itm + ":'\(tmp)'")
    }
}

enum PeripheralError: Error {
    case serviceNotFound
    case characteristicNotFound
}
