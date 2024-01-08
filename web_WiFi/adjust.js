window.onload = function () {
    const XHR = new XMLHttpRequest();
    XHR.open("GET", url + "/api/get_ini_angles", true);
    XHR.send();

    XHR.onreadystatechange = (e) => {
        if (XHR.readyState === XMLHttpRequest.DONE) {
            const status = XHR.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                const paras = JSON.parse(XHR.responseText);
                console.log(paras);
                document.getElementById("ll_ini").value = 180 - paras.ll_ini;
                document.getElementById("fl_ini").value = paras.fl_ini;
                document.getElementById("lr_ini").value = 180 - paras.lr_ini;
                document.getElementById("fr_ini").value = paras.fr_ini;
                document.getElementById("ll_ini").classList.remove('ra');
                document.getElementById("fl_ini").classList.remove('ra');
                document.getElementById("lr_ini").classList.remove('ra');
                document.getElementById("fr_ini").classList.remove('ra');
            }
        }
    }
}

function set_angles_ini() {
    const ll_ini = 180 - document.getElementById("ll_ini").value;
    const fl_ini = document.getElementById("fl_ini").value;
    const lr_ini = 180 - document.getElementById("lr_ini").value;
    const fr_ini = document.getElementById("fr_ini").value;
    const para = "ll_ini=" + ll_ini + "&fl_ini=" + fl_ini + "&lr_ini=" + lr_ini + "&fr_ini=" + fr_ini;
    const XHR = new XMLHttpRequest();
    XHR.open("GET", url + "/api/set_ini_angles?" + para, true);
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
