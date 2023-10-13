// 情報元： https://shimz.me/blog/microbit/5456
//          https://gunmagisgeek.com/blog/microbit/5456
//          https://playing-engineer.com/wordpress/2018/06/04/microbit-ble-chrome-browserpromise/
//          https://qiita.com/nakazawaken1/items/4a15480899722a33e8ee
let bluetoothDevice;
let tx_characteristic;
let rx_characteristic;

// BLE UUID
const UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_SERVICE_TX_CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const UART_SERVICE_RX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

window.onload = function () {

    // BLE connection process
    document.getElementById('connect').addEventListener('click', function () {
        let options = {};

        //options.acceptAllDevices = true;

        options.filters = [
            { services: [UART_SERVICE] },
            { namePrefix: "BBC micro:bit" },
            { namePrefix: "mpy-uart" }
        ];

        navigator.bluetooth.requestDevice(options)
            .then(device => {
                bluetoothDevice = device;
                console.log("device", device);
                return device.gatt.connect();
            })
            .then(server => {
                console.log("server", server)
                return server.getPrimaryService(UART_SERVICE);
            })
            .then(service => {
                console.log("service", service)
                return Promise.all([
                    service.getCharacteristic(UART_SERVICE_TX_CHARACTERISTIC),
                    service.getCharacteristic(UART_SERVICE_RX_CHARACTERISTIC)
                ]);
            })
            .then(chara => {
                console.log("characteristic", chara)
                tx_characteristic = chara[0];
                tx_characteristic.startNotifications();
                tx_characteristic.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged);
                rx_characteristic = chara[1];

                document.getElementById("status").innerHTML = "Connected !";
                const elems = document.getElementsByClassName("connect-btn");
                elems[0].classList.add('display-none');
                elems[1].classList.remove('display-none');
                send_message('get angles_init');

                return chara;
            })
            .catch(error => {
                console.log(error);
            });
    });

    // BLE disconnection process
    document.getElementById('disconnect').addEventListener('click', function () {
        if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return;
        bluetoothDevice.gatt.disconnect();

        document.getElementById("status").innerHTML = "Disconnected !";
        const elems = document.getElementsByClassName("connect-btn");
        elems[0].classList.remove('display-none');
        elems[1].classList.add('display-none');

    });

    panel_button_addEvens();
    direct_button_addEvens();
    reset_button_addEvens();
    radio_button_addEvens();

}

// Receive messages from picoW
function onCharacteristicValueChanged(e) {
    let str_arr = [];
    for (let i = 0; i < this.value.byteLength; i++) {
        str_arr[i] = this.value.getUint8(i);
    }
    let str = String.fromCharCode.apply(null, str_arr);

    check_rx_data(str);

}

let tx_buffer = [];

// Send message
function send_message(message) {
    if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !rx_characteristic) {
        alert('Please connect.');
        return;
    }
    let ArrayBuffer = new TextEncoder().encode(message + '\n');
    rx_characteristic.writeValueWithResponse(ArrayBuffer)
        .then(ans => {
            if (tx_buffer.length > 0) {
                // Retrieve and send data that could not be sent
                let ArrayBuffer2 = tx_buffer.pop();
                rx_characteristic.writeValueWithoutResponse(ArrayBuffer2);
            }
        })
        .catch(error => {
            // Save data that could not be sent
            tx_buffer.unshift(ArrayBuffer);
        });
}

function check_rx_data(str) {
    let args = str.split(' ');
    if (args.length == 2) {
        paras = args[1].split(',');
        if (args[0] === 'ri') {
            document.getElementById("ll_ini").value = 180 - parseInt(paras[0]);
            document.getElementById("fl_ini").value = parseInt(paras[1]);
            document.getElementById("lr_ini").value = 180 - parseInt(paras[2]);
            document.getElementById("fr_ini").value = parseInt(paras[3]);
            document.getElementById("adjust-table").classList.remove('display-none');
            document.getElementById("adj_result").innerHTML = "leg_left_angle_init=" + paras[0] + "<br>" + "foot_left_angle_init=" + paras[1] + "<br>" + "leg_right_angle_init=" + paras[2] + "<br>" + "foot_right_angle_init=" + paras[3];
        } else if (args[0] === 'ra') {
            document.getElementById("id_angle_left_leg").value = parseInt(paras[0]);
            document.getElementById("id_angle_left_foot").value = parseInt(paras[1]);
            document.getElementById("id_angle_right_leg").value = parseInt(paras[2]);
            document.getElementById("id_angle_right_foot").value = parseInt(paras[3]);
        }
    }
}

function set_angles_ini() {
    const ll_ini = 180 - document.getElementById("ll_ini").value;
    const fl_ini = document.getElementById("fl_ini").value;
    const lr_ini = 180 - document.getElementById("lr_ini").value;
    const fr_ini = document.getElementById("fr_ini").value;
    let tx_str = "si " + ll_ini + "," + fl_ini + "," + lr_ini + "," + fr_ini;
    send_message(tx_str);
    document.getElementById("adj_result").innerHTML = "leg_left_angle_init=" + ll_ini + "<br>" + "foot_left_angle_init=" + fl_ini + "<br>" + "leg_right_angle_init=" + lr_ini + "<br>" + "foot_right_angle_init=" + fr_ini;
}

function set_angles() {
    const left_leg = parseInt(document.getElementById("id_angle_left_leg").textContent);
    const left_foot = parseInt(document.getElementById("id_angle_left_foot").textContent);
    const right_leg = parseInt(document.getElementById("id_angle_right_leg").textContent);
    const right_foot = parseInt(document.getElementById("id_angle_right_foot").textContent);
    const tx_str = "sa " + left_leg + "," + left_foot + "," + right_leg + "," + right_foot;
    send_message(tx_str);
}

let latest_off = ""; /// Remembers if off operation is required
let timeoutID = null;

function panel_button_addEvens() {
    /*#
    # panel define
    #
    #  "button_number": { "key": "nummber", "on": "command_name1", "off": "command_name2"}
    #    nummber       --- panel button nummber
    #    command_name1 --- execute a comannd when mousedown, touchstart
    #    command_name2 --- execute a command when mouseup, touchend, mouseout, touchcancel
    #*/
    const paneldef = [
        { "key": "1", "on": "forward_left", "off": "stop" },
        { "key": "2", "on": "forward", "off": "stop" },
        { "key": "3", "on": "forward_right", "off": "stop" },
        { "key": "4", "on": "turn_left", "off": "stop" },
        { "key": "5", "on": "stop", "off": "" },
        { "key": "6", "on": "turn_right", "off": "stop" },
        { "key": "7", "on": "backward_left", "off": "stop" },
        { "key": "8", "on": "backward", "off": "stop" },
        { "key": "9", "on": "backward_right", "off": "stop" },
    ];

    paneldef.forEach(function (value) {
        const elmnt = document.getElementById("btn" + value.key);
        elmnt.addEventListener("mousedown", () => {
            event.preventDefault();
            sendCmd(value.on);
            latest_off = value.off;
        });
        elmnt.addEventListener("touchstart", () => {
            event.preventDefault();
            sendCmd(value.on);
            latest_off = value.off;
        });
        if (value.off !== "") {
            elmnt.addEventListener("mouseup", () => {
                event.preventDefault();
                sendCmd(value.off);
                latest_off = "";
            });
            elmnt.addEventListener("touchend", () => {
                event.preventDefault();
                sendCmd(value.off);
                latest_off = "";
            });
            elmnt.addEventListener("mouseout", () => {
                event.preventDefault();
                if (latest_off !== "") {
                    sendCmd(value.off);
                    latest_off = "";
                }
            });
            elmnt.addEventListener("mouseout", () => {
                event.preventDefault();
                if (latest_off !== "") {
                    sendCmd(value.off);
                    latest_off = "";
                }
            });
        }
    });
}

function sendCmd(cmd) {
    send_message(String(cmd));
}

function direct_button_addEvens() {
    const legs = ["right_foot", "left_foot", "right_leg", "left_leg"];
    legs.forEach(function (element) {
        document.getElementById("id_inc_" + element).addEventListener("mousedown", () => {
            event.preventDefault();
            timerset_inc(element);
        });
        document.getElementById("id_inc_" + element).addEventListener("touchstart", () => {
            event.preventDefault();
            timerset_inc(element);
        });
        document.getElementById("id_inc_" + element).addEventListener("mouseup", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
        document.getElementById("id_inc_" + element).addEventListener("touchend", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
        document.getElementById("id_inc_" + element).addEventListener("mouseout", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
        document.getElementById("id_inc_" + element).addEventListener("touchcancel", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
        document.getElementById("id_dec_" + element).addEventListener("mousedown", () => {
            event.preventDefault();
            timerset_dec(element);
        });
        document.getElementById("id_dec_" + element).addEventListener("touchstart", () => {
            event.preventDefault();
            timerset_dec(element);
        });
        document.getElementById("id_dec_" + element).addEventListener("mouseup", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
        document.getElementById("id_dec_" + element).addEventListener("touchend", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
        document.getElementById("id_dec_" + element).addEventListener("mouseout", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
        document.getElementById("id_dec_" + element).addEventListener("touchcancel", () => {
            event.preventDefault();
            clearRepeatBtn();
        });
    });
}

function reset_button_addEvens() {
    document.getElementById("id_reset_foot_angle").addEventListener("click", () => {
        document.getElementById("id_angle_right_foot").textContent = "90";
        document.getElementById("id_angle_left_foot").textContent = "90";
        set_angle();
    });
    document.getElementById("id_reset_leg_angle").addEventListener("click", () => {
        document.getElementById("id_angle_right_leg").textContent = "90";
        document.getElementById("id_angle_left_leg").textContent = "90";
        set_angle();
    });
}

function radio_button_addEvens() {
    let radio_btns = document.querySelectorAll(`input[type='radio'][name='reference_plane']`);

    for (let target of radio_btns) {
        target.addEventListener(`change`, function () {
            set_angle();
        });
    }
}


function number2range(w) {
    let ang = parseInt(document.getElementById("id_angle_" + w).value);
    ang = 0 - ang;
    document.getElementById("range_" + w).value = ang;
    rotate_leg(w, ang);
}

function range2number(w) {
    let ang = parseInt(document.getElementById("range_" + w).value);
    document.getElementById("id_angle_" + w).value = 0 - ang;
    rotate_leg(w, ang);
}

function rotate_leg(w, ang) {
    document.getElementById("leg_" + w).style.setProperty('transform', 'rotate(' + (90 - ang) + 'deg)');
}

function check_num(input_str) {
    let input_value = parseInt(input_str);
    if (input_value < -80) {
        input_value = -80;
    } else if (input_value > 80) {
        input_value = 80;
    } else if (isNaN(input_value)) {
        input_value = 0;
    }
    return input_value;
}

function inc_tover_next(leg) {
    timeoutID = setTimeout(function () {
        anginc(leg);
        inc_tover_next(leg);
    }, 50);
}

function timerset_inc(leg) {
    anginc(leg);
    timeoutID = setTimeout(function () {
        anginc(leg);
        inc_tover_next(leg);
    }, 600);
}

function dec_tover_next(leg) {
    timeoutID = setTimeout(function () {
        angdec(leg);
        dec_tover_next(leg);
    }, 50);
}

function timerset_dec(leg) {
    angdec(leg);
    timeoutID = setTimeout(function () {
        angdec(leg);
        dec_tover_next(leg);
    }, 600);
}

function clearRepeatBtn() {
    clearTimeout(timeoutID);
}

function anginc(w) {
    const elm = document.getElementById("id_angle_" + w);
    val = parseInt(elm.textContent);
    if (isNaN(val)) { val = 0; }
    if (val >= 170) {
        val = 170 - 1;
    } else if (val < 10) {
        val = 10;
    }
    val += 1;
    elm.textContent = val;
    set_angle();
}

function angdec(w) {
    const elm = document.getElementById("id_angle_" + w);
    val = parseInt(elm.textContent);
    if (isNaN(val)) { val = 0; }
    if (val > 170) {
        val = 170;
    } else if (val <= 10) {
        val = 10 + 1;
    }
    val -= 1;
    elm.textContent = val;
    set_angle();
}

let tabs = document.getElementById('tabcontrol').getElementsByTagName('a');
const pages = document.getElementsByClassName('pages');

function changeTab() {
    // ▼href属性値から対象のid名を抜き出す
    let targetid = this.href.substring(this.href.indexOf('#') + 1, this.href.length);

    // ▼指定のタブページだけを表示する
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id != targetid) {
            pages[i].style.display = "none";
        }
        else {
            pages[i].style.display = "block";
        }
    }

    // ▼クリックされたタブを前面に表示する
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.zIndex = "0";
    }
    this.style.zIndex = "10";

    if (targetid === "tabpage2") {
        send_message('get angles');
    } else if (targetid === "tabpage3") {
        send_message('sa 90,90,90,90');
    }

    // ▼ページ遷移しないようにfalseを返す
    return false;
}

// ▼すべてのタブに対して、クリック時にchangeTab関数が実行されるよう指定する
for (let i = 0; i < tabs.length; i++) {
    tabs[i].onclick = changeTab;
}

// ▼最初は先頭のタブを選択
tabs[0].onclick();
