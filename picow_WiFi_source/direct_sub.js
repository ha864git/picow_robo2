
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
