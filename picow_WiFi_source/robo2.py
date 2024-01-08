from machine import Timer
import micropython
import robo2_servo_sg90_kitronik5348
import robo2_angles_ini

class robo2:

    def __init__ (self):
        self._servomotor = robo2_servo_sg90_kitronik5348.PIOServo()
        self._angles = [90, 90, 90, 90]
        self._angles_ini = [robo2_angles_ini.ll_ini, robo2_angles_ini.fl_ini, robo2_angles_ini.lr_ini, robo2_angles_ini.fr_ini]
        self._update_angle()
        self._play_list = []
        self._play_pointer = 0
        self._play_mode = 0
        self._cmd_request = 'stop'
        self._latest_leg_UP = 'Left'
        self._latest_direct = ''
        self._cmd_list = [
            ["forward", 110, 110, 70, 70],
            ["forward_right", 110, 100, 70, 80],
            ["forward_left", 100, 110, 80, 70],
            ["backward", 70, 70, 110, 110],
            ["backward_right", 70, 80, 110, 100],
            ["backward_left", 80, 70, 100, 110],
            ["turn_right", 100, 80, 80, 100],
            ["turn_left", 80, 100, 100, 80],
            ["stop", 90, 90, 90, 90],
            ["direct1", 90, 90, 90, 90],
            ["direct2", 90, 90, 90, 90]
        ]
        self._intervalTimer = Timer()
        micropython.alloc_emergency_exception_buf(100)
        self._intervalTimer.init(mode=Timer.PERIODIC, freq=50, callback=self._timeover)

    def set_request_name(self, name):
        for cmd in self._cmd_list:
            if cmd[0] == name:
                self._cmd_request = name
                return True
        return False

    def get_angles_ini(self):
        ll_ini = self._angles_ini[0]
        fl_ini = self._angles_ini[1]
        lr_ini = self._angles_ini[2]
        fr_ini = self._angles_ini[3]
        return ll_ini, fl_ini, lr_ini, fr_ini

    def set_angles_ini(self, ll_ini, fl_ini, lr_ini, fr_ini):
        self._angles_ini = [ll_ini, fl_ini, lr_ini, fr_ini]
        fstr = 'll_ini = ' + str(ll_ini)
        fstr += '\n' + 'fl_ini = ' + str(fl_ini)
        fstr += '\n' + 'lr_ini = ' + str(lr_ini)
        fstr += '\n' + 'fr_ini = ' + str(fr_ini)
        f = open('robo2_angles_ini.py', 'w')
        f.write(fstr)
        f.close()

    def get_angles(self):
        ll = self._angles[0]
        fl = self._angles[1]
        lr = self._angles[2]
        fr = self._angles[3]
        return ll, fl, lr, fr

    def set_angle_direct(self, ll, fl, lr, fr):
        cmd_diect = 'direct1'
        if self._latest_direct == 'direct1':
            cmd_diect = 'direct2'
        list = [cmd_diect, ll, fl, lr, fr] 
        found = False
        for i in range(len(self._cmd_list)):
            if self._cmd_list[i][0] == list[0]:
                self._cmd_list[i] = list
                found = True
                break
        if not found:
            self._cmd_list.append(list)
        self.set_request_name(list[0])

    def _update_angle(self):
        for i in range(4):
            self._servomotor.goToPosition(i, self._angles[i] + self._angles_ini[i] - 90)

    def _set_leg(self, right_target, left_target, right_pitch, left_pitch):
        _result = 2
        i = 2
        self._angles[i] = self._get_angle(right_target, right_pitch, self._angles[i])
        self._servomotor.goToPosition(i, self._angles[i] + self._angles_ini[i] - 90)
        if self._angles[i] == right_target:
            _result -= 1
        i = 0 
        self._angles[i] = self._get_angle(left_target, left_pitch, self._angles[i])
        self._servomotor.goToPosition(i, self._angles[i] + self._angles_ini[i] - 90)
        if self._angles[i] == left_target:
            _result -= 1
        return _result

    def _set_foot(self, right_target, left_target, right_pitch, left_pitch):
        _result = 2
        i = 3
        self._angles[i] = self._get_angle(right_target, right_pitch, self._angles[i])
        self._servomotor.goToPosition(i, self._angles[i] + self._angles_ini[i] - 90)
        if self._angles[i] == right_target:
            _result -= 1
        i = 1 
        self._angles[i] = self._get_angle(left_target, left_pitch, self._angles[i])
        self._servomotor.goToPosition(i, self._angles[i] + self._angles_ini[i] - 90)
        if self._angles[i] == left_target:
            _result -= 1
        return _result

    def _get_angle(self, target, pitch, current):
        ans_get_angle = current
        if pitch == 0:
            ans_get_angle = target
        elif ans_get_angle >= target + pitch:
            ans_get_angle -= pitch
        elif ans_get_angle <= target - pitch:
            ans_get_angle += pitch
        else:
            ans_get_angle = target
        return ans_get_angle

    def _timeover(self, timer):
        if self._play_mode != 0:
            self._play()
        else:
            self._play_set()

    def _play(self):
        if len(self._play_list) > 0:
            if self._play_pointer >= len(self._play_list):
                self._play_pointer = 0
                self._play_mode = 0
            else:
                if self._play_list[self._play_pointer][0] == 'l':
                    if 0 == self._set_leg(self._play_list[self._play_pointer][1], self._play_list[self._play_pointer][2], self._play_list[self._play_pointer][3], self._play_list[self._play_pointer][4]):
                        self._play_pointer += 1
                else:
                    if 0 == self._set_foot(self._play_list[self._play_pointer][1], self._play_list[self._play_pointer][2], self._play_list[self._play_pointer][3], self._play_list[self._play_pointer][4]):
                        self._play_pointer += 1

    def _play_set(self):
        if self._cmd_request == 'stop':
            if self._angles[2] != 90 or self._angles[0] != 90:
                self._set_play_list(90, 90, 90, 90)
        else:
            for cmd in self._cmd_list:
                if cmd[0] == self._cmd_request:
                    if self._cmd_request == 'direct1' or self._cmd_request == 'direct2':
                        if self._latest_direct != self._cmd_request:
                            self._latest_direct = self._cmd_request
                            self._play_list = [
                            #    ['f', cmd[4], cmd[2], 0, 0],
                                ['f', cmd[4], cmd[2], 1, 1],
                            #    ['l', cmd[3], cmd[1], 0, 0]
                                ['l', cmd[3], cmd[1], 1, 1]
                            ]
                            self._play_pointer = 0
                            self._play_mode = 1
                    else: 
                        self._set_play_list(cmd[1], cmd[2], cmd[3], cmd[4])
                    break

    def _set_play_list(self, Rup_right, Rup_left, Lup_right, Lup_left):
        if self._latest_leg_UP != 'Right':
            self._play_list = [
                ['f', 122, 106, 8, 4],
                ['l', Rup_right, Rup_left, 3, 3],
                ['f', 90, 90, 8, 4]
            ]
            self._latest_leg_UP = 'Right'
        else:
            self._play_list = [
                ['f', 74, 58, 4, 8],
                ['l', Lup_right, Lup_left, 3, 3],
                ['f', 90, 90, 4, 8]
            ]
            self._latest_leg_UP = 'Left'
        self._play_pointer = 0
        self._play_mode = 1
