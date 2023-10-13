import robo2
import json

class webcnt:

    def __init__ (self):
        self._robo = robo2.robo2()


    def _webpage_js(self, fjs):
        msgheader = "Content-Type: text/javascript\r\n"
        print(fjs)
        f = open(fjs)
        js = f.read()
        msgbody = str(js)
        return msgheader, msgbody

    def _webpage_css(self, fcss):
        msgheader = "Content-Type: text/css\r\n"
        f = open(fcss)
        css = f.read()
        msgbody = str(css)
        return msgheader, msgbody

    def _webpage_index(self):
        msgheader = "Content-Type: text/html\r\n"
        f = open("index.html")
        html = f.read()
        msgbody = str(html)
        return msgheader, msgbody

    def _webpage_direct(self):
        msgheader = "Content-Type: text/html\r\n"
        f = open("direct.html")
        html = f.read()
        msgbody = str(html)
        return msgheader, msgbody

    def _webpage_adjust(self):
        msgheader = "Content-Type: text/html\r\n"
        f = open("adjust.html")
        html = f.read()
        msgbody = str(html)
        return msgheader, msgbody

    def _api_get_angles(self, getpara):
        ll, fl, lr, fr = self._robo.get_angles()
        ans = {"ll":ll, "fl":fl, "lr":lr, "fr":fr}
        msgbody = json.dumps(ans)
        msgheader = "Content-Type: application/json\r\n"
        msgheader += "Access-Control-Allow-Origin: *\r\n"
        return msgheader, msgbody

    def _api_get_angles_ini(self, getpara):
        ll_ini, fl_ini, lr_ini, fr_ini = self._robo.get_angles_ini()
        ans = {"ll_ini":ll_ini, "fl_ini":fl_ini, "lr_ini":lr_ini, "fr_ini":fr_ini}
        msgbody = json.dumps(ans)
        msgheader = "Content-Type: application/json\r\n"
        msgheader += "Access-Control-Allow-Origin: *\r\n"
        return msgheader, msgbody

    def _api_set_angles(self, getpara):
        ll = getpara["ll"]
        fl = getpara["fl"]
        lr = getpara["lr"]
        fr = getpara["fr"]
        self._robo.set_angle_direct(ll, fl, lr, fr)
        ans = {"ll":ll, "fl":fl, "lr":lr, "fr":fr}
        msgbody = json.dumps(ans)
        msgheader = "Content-Type: application/json\r\n"
        msgheader += "Access-Control-Allow-Origin: *\r\n"
        return msgheader, msgbody

    def _api_set_angles_ini(self, getpara):
        ll_ini = getpara["ll_ini"]
        fl_ini = getpara["fl_ini"]
        lr_ini = getpara["lr_ini"]
        fr_ini = getpara["fr_ini"]
        self._robo.set_angles_ini(ll_ini, fl_ini, lr_ini, fr_ini)
        self._robo.set_angle_direct(90, 90, 90, 90)
        ans = {"ll_ini":ll_ini, "fl_ini":fl_ini, "lr_ini":lr_ini, "fr_ini":fr_ini}
        msgbody = json.dumps(ans)
        msgheader = "Content-Type: application/json\r\n"
        msgheader += "Access-Control-Allow-Origin: *\r\n"
        return msgheader, msgbody

    def _api_exe_command(self, getpara):
        ans = {"cmd_name": "not_specified"}
        if 'cmd_name' in getpara:
            cmd_name = getpara["cmd_name"]
            ans = {"cmd_name": "host_undefined"}
            if self._robo.set_request_name(cmd_name):
                ans = {"cmd_name": cmd_name}
        msgbody = json.dumps(ans)
        msgheader = "Content-Type: application/json\r\n"
        msgheader += "Access-Control-Allow-Origin: *\r\n"
        return msgheader, msgbody

    def check_request(self, request):
        postpara = {}
        getpara = {}
        payload = ''
        try:
            payload = request.split('\\r\\n')[-1].replace("'","")
            if payload != '':
                temp = payload.split('&')
                for s in temp:
                    s2 = s.split('=')
                    if s2[1].isdigit():
                        s2[1] = int(s2[1])
                    elif s2[1][0] == '-':
                        s2[1] = 0 - int(s2[1][1:])
                    postpara[s2[0]] = s2[1]
            print(postpara)
        except IndexError:
            pass

        try:
            request = request.split()[1]
            temp0 = request.split('?')[-1]
            if temp0 != '':
                temp = temp0.split('&')
                for s in temp:
                    s2 = s.split('=')
                    if s2[1].isdigit():
                        s2[1] = int(s2[1])
                    elif s2[1][0] == '-':
                        s2[1] = 0 - int(s2[1][1:])
                    getpara[s2[0]] = s2[1]
            print(getpara)            
        except IndexError:
            pass

        msgheader = ""
        msgbody = ""

        if request.find('.css') != -1:
            tmp0 = request.split('.css')
            tmp1 = tmp0[0].split('/')
            if len(tmp1) == 2:
                msgheader, msgbody = self._webpage_css(tmp1[1] + '.css')            

        elif request.find('.js') != -1:
            tmp0 = request.split('.js')
            tmp1 = tmp0[0].split('/')
            if len(tmp1) == 2:
                msgheader, msgbody = self._webpage_js(tmp1[1] + '.js')            

        elif request.find('/index.html') != -1:
            msgheader, msgbody = self._webpage_index()

        elif request.find('/direct.html') != -1:
            msgheader, msgbody = self._webpage_direct()

        elif request.find('/adjust.html') != -1:
            self._robo.set_angle_direct(90, 90, 90, 90)
            msgheader, msgbody = self._webpage_adjust()

        elif request.find('/api/get_angles') != -1:
            msgheader, msgbody = self._api_get_angles(getpara)            

        elif request.find('/api/get_ini_angles') != -1:
            msgheader, msgbody = self._api_get_angles_ini(getpara)            

        elif request.find('/api/set_angles?') != -1:
            msgheader, msgbody = self._api_set_angles(getpara)            

        elif request.find('/api/set_ini_angles?') != -1:
            msgheader, msgbody = self._api_set_angles_ini(getpara)            

        elif request.find('/api/exe_command?') != -1:
            msgheader, msgbody = self._api_exe_command(getpara)   

        else:
            print('---- else case !!! ----')
            msgheader, msgbody = self._webpage_index()

        return msgheader, msgbody
