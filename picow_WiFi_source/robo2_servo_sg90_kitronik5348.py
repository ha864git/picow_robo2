'''

Customized for SG90 purchased at AKIZUKI DENSHI TSUSHO CO.,LTD.
Limited it to 4 motors and simplified it using the machine library.
by ha864git

<original> 
https://github.com/KitronikLtd/Kitronik-Pico-Simply-Robotics-MicroPython

'''

'''
MIT License

Copyright (c) 2023 ha864git 

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
'''

'''
MIT License

Copyright (c) 2022 Kitronik Ltd 

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
'''

'''
microPython Library for the Kitronik Simply Robotics board for Pico.
www.kitronik.co.uk/5348

API:
    servos.goToPosition(WHICH_SERVO, degrees): Sets a servo's position in degrees.
        where:
            WHICH_SERVO - the servo to control (0 - 4)
            degrees - angle to go to (0 - 180)
        

The servo pins are 15,14,13,12,19,18,17,16 for servo 0 -> servo 7
'''

'''
Class that controls Serovs using the RP2040 PIO to generate the pulses.

ServoControl: for SG90 
Servo 0 degrees -> pulse of 0.5ms, 180 degrees 2.4ms 
pulse train freq 50hz - 20mS
1uS is freq of 1000000
servo pulses range from 500 to 2400usec and overall pulse train is 20000usec repeat.
'''

from machine import PWM, Pin

class PIOServo:
    _maxServoPulse = 2400
    _minServoPulse = 500
    _pulseTrain = 20000
    _frequency = 50
    _degreesToUS = (_maxServoPulse - _minServoPulse) / 180

    def __init__ (self):
    # Servo Pins 0:GP15, 1:GP14, 2:GP13, 3:GP12   
        self._servos = [PWM(Pin(15)), PWM(Pin(14)), PWM(Pin(13)), PWM(Pin(12))]
        for s in self._servos:
            s.freq(self._frequency)

    def goToPosition(self, select, degrees):
        pulseLength = int(degrees * self._degreesToUS + self._minServoPulse)
        if pulseLength < self._minServoPulse:
            pulseLength = self._minServoPulse
        if pulseLength > self._maxServoPulse:
            pulseLength = self._maxServoPulse
        if select >= 0 and select <= 3:
            self._servos[select].duty_u16(int(65535 * pulseLength / self._pulseTrain))
            return True
        else:
            return False
