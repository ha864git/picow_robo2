import network
import socket
from time import sleep
import machine

import WIFI_CONFIG
import rp2
import robo2_webpage

def main():
    
    led = machine.Pin("LED", machine.Pin.OUT)

    webct = robo2_webpage.webcnt()

    rp2.country(WIFI_CONFIG.COUNTRY)
    ssid = WIFI_CONFIG.SSID
    password = WIFI_CONFIG.PSK
    
    try:
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(ssid, password)
        while wlan.isconnected() == False:
            print('Waiting for connection...')
            led.toggle()
            sleep(1)
        ip = wlan.ifconfig()[0]
        led.on()
        print(f'Connected on {ip}')

        address = (ip, 80)
        connection = socket.socket()
        connection.bind(address)
        connection.listen(1)
 
        while True:
            client = connection.accept()[0]
            request = client.recv(1024)
            request = str(request)
            print(request)
            msgheader, msgbody = webct.check_request(request)
            status = "HTTP/1.0 200 OK\r\n"
            response = status + msgheader + "\r\n" + msgbody
            client.send(response)
            client.close()
 
    except KeyboardInterrupt:
        machine.reset()

if __name__ == "__main__":
    main()
