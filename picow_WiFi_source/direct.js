const url = "";

window.onload = function () {
    direct_button_addEvens();
    reset_button_addEvens();

    const XHR = new XMLHttpRequest();
    XHR.open("GET", url + "/api/get_angles", true);
    XHR.send();

    XHR.onreadystatechange = (e) => {
        if (XHR.readyState === XMLHttpRequest.DONE) {
            const status = XHR.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                const paras = JSON.parse(XHR.responseText);
                console.log(paras);
                document.getElementById("id_angle_left_leg").innerText = paras.ll;
                document.getElementById("id_angle_left_foot").innerText = paras.fl;
                document.getElementById("id_angle_right_leg").innerText = paras.lr;
                document.getElementById("id_angle_right_foot").innerText = paras.fr;
                set_angle();
                let elm = document.getElementsByClassName("trapa");
                for (let i = elm.length - 1; i >= 0; i--) {
                    elm[i].classList.remove("trapa");
                }
            }
        }
    }
}

function set_angles() {
    let ll = parseInt(document.getElementById("id_angle_left_leg").innerText);
    let fl = parseInt(document.getElementById("id_angle_left_foot").innerText);
    let lr = parseInt(document.getElementById("id_angle_right_leg").innerText);
    let fr = parseInt(document.getElementById("id_angle_right_foot").innerText);
    let para = "ll=" + ll + "&fl=" + fl + "&lr=" + lr + "&fr=" + fr;
    const XHR = new XMLHttpRequest();
    XHR.open("GET", url + "/api/set_angles?" + para, true);
    XHR.send();

    XHR.onreadystatechange = (e) => {
        if (XHR.readyState === XMLHttpRequest.DONE) {
            const status = XHR.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                const paras = JSON.parse(XHR.responseText);
                console.log(paras);
            }
        }
    }
}

let timeoutID = null;

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

function set_angle() {

    const left_foot_angle = parseInt(document.getElementById("id_angle_left_foot").innerText);
    const right_foot_angle = parseInt(document.getElementById("id_angle_right_foot").innerText);
    const left_leg_angle = parseInt(document.getElementById("id_angle_left_leg").innerText);
    const right_leg_angle = parseInt(document.getElementById("id_angle_right_leg").innerText);

    const dlt_left_foot_angle = 90 - left_foot_angle;
    const dlt_right_foot_angle = 90 - right_foot_angle;
    const dlt_left_leg_angle = left_leg_angle - 90;
    const dlt_right_leg_angle = right_leg_angle - 90;

    document.getElementById("right_foot").style.transform = "rotate(" + dlt_right_foot_angle + "deg)";
    document.getElementById("right_foot_soale").style.transform = "rotate(" + dlt_right_foot_angle + "deg)";
    document.getElementById("left_foot").style.transform = "rotate(" + dlt_left_foot_angle + "deg)";
    document.getElementById("left_foot_soale").style.transform = "rotate(" + dlt_left_foot_angle + "deg)";
    document.getElementById("right_leg").style.transform = "rotate(" + dlt_right_leg_angle + "deg)";
    document.getElementById("left_leg").style.transform = "rotate(" + dlt_left_leg_angle + "deg)";

}