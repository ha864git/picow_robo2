const url = "";

let latest_off = ""; /// Remembers if off operation is required

window.onload = function () {
    panel_button_addEvens();
}

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
            execGetCmd(value.on);
            latest_off = value.off;
        });
        elmnt.addEventListener("touchstart", () => {
            event.preventDefault();
            execGetCmd(value.on);
            latest_off = value.off;
        });
        if (value.off !== "") {
            elmnt.addEventListener("mouseup", () => {
                event.preventDefault();
                execGetCmd(value.off);
                latest_off = "";
            });
            elmnt.addEventListener("touchend", () => {
                event.preventDefault();
                execGetCmd(value.off);
                latest_off = "";
            });
            elmnt.addEventListener("mouseout", () => {
                event.preventDefault();
                if (latest_off !== "") {
                    execGetCmd(value.off);
                    latest_off = "";
                }
            });
            elmnt.addEventListener("mouseout", () => {
                event.preventDefault();
                if (latest_off !== "") {
                    execGetCmd(value.off);
                    latest_off = "";
                }
            });
        }
    });
}

function execGetCmd(cmd_name) {
    const XHR = new XMLHttpRequest();
    XHR.open("GET", url + "/api/exe_command?cmd_name=" + cmd_name, true);
    XHR.send();
    XHR.onreadystatechange = (e) => {
        if (XHR.readyState === XMLHttpRequest.DONE) {
            const status = XHR.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                console.log(XHR.responseText);
            }
        }
    }
}

