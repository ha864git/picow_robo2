"""

MIT License

Copyright (c) 2023, ha864

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

"""
"""

This program was created by modifying the program at the URL below.

https://github.com/hbldh/bleak/blob/develop/examples/uart_service.py

"""
"""

MIT License

Copyright (c) 2020, Henrik Blidh

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

"""

import asyncio
import sys
from itertools import count, takewhile
from typing import Iterator

from bleak import BleakClient, BleakScanner
from bleak.backends.characteristic import BleakGATTCharacteristic

UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
UART_TX_CHAR_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
UART_RX_CHAR_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

class ble_uart:

    def __init__(self, tx_queue, rx_queue, target_names):
        self._qrx = rx_queue
        self._qtx = tx_queue
        self._target_name = target_names

    def _sliced(self, data: bytes, n: int) -> Iterator[bytes]:
        return takewhile(len, (data[i: i + n] for i in count(0, n)))

    def _name_filter(self, device, ad):
        print(device.name)
        res = False
        for na in self._target_name:
            res = res or (device.name and na in device.name)
        return res

    def _handle_disconnect(self, _: BleakClient):
        print("Device was disconnected, goodbye.")
        # cancelling all tasks effectively ends the program
        self._qrx.put('quit')
        for task in asyncio.all_tasks():
            task.cancel()

    def _handle_rx(self, _: BleakGATTCharacteristic, data: bytearray):
        print("received:", data)
        rxdata = data.decode('utf-8').replace('\n','').replace('\r','')
        if len(rxdata) > 0:
            self._qrx.put(rxdata)

    async def uart_ifq(self):

        device = await BleakScanner.find_device_by_filter(self._name_filter)

        print(device)

        if device is None:
            print("no matching device found, you may need to edit target name.")
            self._qrx.put('notfound')
            sys.exit(1)

        async with BleakClient(device, disconnected_callback=self._handle_disconnect) as client:
            await client.start_notify(UART_TX_CHAR_UUID, self._handle_rx)
            self._qrx.put('conected')

            nus = client.services.get_service(UART_SERVICE_UUID)
            rx_char = nus.get_characteristic(UART_RX_CHAR_UUID)

            while True:
                await asyncio.sleep(0.1)

                if self._qtx.qsize() != 0:
                    txd = self._qtx.get()
                    if txd == 'quit':
                        break
                    data = (txd + '\n').encode('utf-8')
                    for s in self._sliced(data, rx_char.max_write_without_response_size):
                        await client.write_gatt_char(rx_char, s, response=False)
                        print("sent:", data)
