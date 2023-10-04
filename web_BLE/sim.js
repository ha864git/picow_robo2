'use strict';

const mag = 2.0;
const img_center = 180;

const img_base_width = 80 * mag;
const img_foot_width = 50 * mag;
const img_floor_width = 160 * mag;

const img_base_margin_top = 64;
const img_right_foot_margin_top = img_base_margin_top + 28 * mag;
const img_left_foot_margin_top = img_right_foot_margin_top;
const img_floor_margin_top = img_right_foot_margin_top + 35 * mag;

const img_base_margin_left = img_center - img_base_width / 2;
const img_right_foot_margin_left = img_center - (10 * mag + img_foot_width);
const img_left_foot_margin_left = img_center + 10 * mag;
const img_floor_margin_left = img_center - img_floor_width / 2;

const img_right_foot_base_transform_origin = 15 * mag + 'px ' + 43 * mag + 'px';
const img_left_foot_base_transform_origin = 65 * mag + 'px ' + 43 * mag + 'px';
const img_right_foot_transform_origin = 35 * mag + 'px ' + 15 * mag + 'px';
const img_left_foot_transform_origin = 15 * mag + 'px ' + 15 * mag + 'px';

document.getElementById("base").style.width = img_base_width + 'px';
document.getElementById("base").style.marginTop = img_base_margin_top + 'px';
document.getElementById("base").style.marginLeft = img_base_margin_left + 'px';

document.getElementById("right_foot").style.width = img_foot_width + 'px';
document.getElementById("right_foot").style.marginTop = img_right_foot_margin_top + 'px';
document.getElementById("right_foot").style.marginLeft = img_right_foot_margin_left + 'px';
document.getElementById("right_foot").style.transformOrigin = img_right_foot_transform_origin;

document.getElementById("left_foot").style.width = img_foot_width + 'px';
document.getElementById("left_foot").style.marginTop = img_left_foot_margin_top + 'px';
document.getElementById("left_foot").style.marginLeft = img_left_foot_margin_left + 'px';
document.getElementById("left_foot").style.transformOrigin = img_left_foot_transform_origin;

document.getElementById("floor").style.width = img_floor_width + 'px';
document.getElementById("floor").style.marginTop = img_floor_margin_top + 'px';
document.getElementById("floor").style.marginLeft = img_floor_margin_left + 'px';

const img_body_width = img_base_width;
const img_leg_width = img_foot_width;
const img_body_margin_top = 100;
const img_right_leg_margin_top = img_body_margin_top;
const img_left_leg_margin_top = img_body_margin_top;
const img_body_margin_left = img_base_margin_left;
const img_right_leg_margin_left = img_right_foot_margin_left;
const img_left_leg_margin_left = img_left_foot_margin_left;
const img_right_leg_transform_origin = 35 * mag + 'px ' + 30 * mag + 'px';
const img_left_leg_transform_origin = 15 * mag + 'px ' + 30 * mag + 'px';
const img_right_leg_body_transform_origin = 15 * mag + 'px ' + 30 * mag + 'px';
const img_left_leg_body_transform_origin = 65 * mag + 'px ' + 30 * mag + 'px';

document.getElementById("right_leg").style.width = img_leg_width + 'px';
document.getElementById("right_leg").style.marginTop = img_right_leg_margin_top + 'px';
document.getElementById("right_leg").style.marginLeft = img_right_leg_margin_left + 'px';
document.getElementById("right_leg").style.transformOrigin = img_right_leg_transform_origin;

document.getElementById("left_leg").style.width = img_leg_width + 'px';
document.getElementById("left_leg").style.marginTop = img_left_leg_margin_top + 'px';
document.getElementById("left_leg").style.marginLeft = img_left_leg_margin_left + 'px';
document.getElementById("left_leg").style.transformOrigin = img_left_leg_transform_origin;

document.getElementById("body2").style.width = img_body_width + 'px';
document.getElementById("body2").style.marginTop = img_body_margin_top + 'px';
document.getElementById("body2").style.marginLeft = img_body_margin_left + 'px';
document.getElementById("body2").style.transformOrigin = img_right_leg_body_transform_origin;

let elements = document.getElementsByTagName("img");
Array.prototype.forEach.call(elements, function (element) {
  element.classList.remove("hidden");
});

function set_angle() {

  const left_foot_angle = parseInt(document.getElementById("id_angle_left_foot").innerText);
  const right_foot_angle = parseInt(document.getElementById("id_angle_right_foot").innerText);
  const left_leg_angle = parseInt(document.getElementById("id_angle_left_leg").innerText);
  const right_leg_angle = parseInt(document.getElementById("id_angle_right_leg").innerText);

  const dlt_left_foot_angle = 90 - left_foot_angle;
  const dlt_right_foot_angle = 90 - right_foot_angle;
  const dlt_left_leg_angle = left_leg_angle - 90;
  const dlt_right_leg_angle = right_leg_angle - 90;

  let left_foot_deg = left_foot_angle - 90;
  let right_foot_deg = right_foot_angle - 90;

  const l1x0 = -15 * mag;
  const l1y0 = -20 * mag;
  const l2x0 = 35 * mag;
  const l2y0 = -20 * mag;
  let l1x = Math.cos(Math.PI / 180 * left_foot_deg) * l1x0 - Math.sin(Math.PI / 180 * left_foot_deg) * l1y0;
  let l1y = Math.sin(Math.PI / 180 * left_foot_deg) * l1x0 + Math.cos(Math.PI / 180 * left_foot_deg) * l1y0;
  let l2x = Math.cos(Math.PI / 180 * left_foot_deg) * l2x0 - Math.sin(Math.PI / 180 * left_foot_deg) * l2y0;
  let l2y = Math.sin(Math.PI / 180 * left_foot_deg) * l2x0 + Math.cos(Math.PI / 180 * left_foot_deg) * l2y0;

  const r1x0 = 15 * mag;
  const r1y0 = -20 * mag;
  const r2x0 = -35 * mag;
  const r2y0 = -20 * mag;
  let r1x = Math.cos(Math.PI / 180 * right_foot_deg) * r1x0 - Math.sin(Math.PI / 180 * right_foot_deg) * r1y0;
  let r1y = Math.sin(Math.PI / 180 * right_foot_deg) * r1x0 + Math.cos(Math.PI / 180 * right_foot_deg) * r1y0;
  let r2x = Math.cos(Math.PI / 180 * right_foot_deg) * r2x0 - Math.sin(Math.PI / 180 * right_foot_deg) * r2y0;
  let r2y = Math.sin(Math.PI / 180 * right_foot_deg) * r2x0 + Math.cos(Math.PI / 180 * right_foot_deg) * r2y0;

  l1x += 25 * mag;
  l2x += 25 * mag;
  r1x -= 25 * mag;
  r2x -= 25 * mag;

  let xy = [[r1x, r1y, l1x, l1y, 0, 0], [r1x, r1y, l2x, l2y, 0, 0], [r2x, r2y, l1x, l1y, 0, 0], [r2x, r2y, l2x, l2y, 0, 0]];

  let y0_min = 10000;
  let result_index = 0;
  xy.forEach(function (elem, index) {
    let y0 = elem[1] + (0 - elem[0]) * (elem[3] - elem[1]) / (elem[2] - elem[0]);
    let yb = elem[1] + ((0 - 25 * mag) - elem[0]) * (elem[3] - elem[1]) / (elem[2] - elem[0]);
    elem[4] = y0;
    elem[5] = yb;
    if (y0_min > y0) {
      result_index = index;
      y0_min = y0;
    }
  });

  let grand_rad = Math.atan2(xy[result_index][3] - xy[result_index][1], xy[result_index][2] - xy[result_index][0]);
  let grand_deg = grand_rad * 180 / Math.PI;
  let garad_y_offset = Math.cos(grand_rad) * xy[result_index][5] + (20 * mag);

  let yx = xy.sort(function (a, b) { return (b[4] - a[4]); });

  let elems = document.getElementsByName("reference_plane");
  let mode = "";
  for (let i = 0; i < elems.length; i++) {
    if (elems[i].checked) {
      mode = elems[i].value;
    }
  }

  if (mode == 'floor') {

    document.getElementById("base").style.transformOrigin = img_right_foot_base_transform_origin;
    const base_transrateX = 0;
    const base_transrateY = garad_y_offset;
    const base_rotate = grand_deg;
    document.getElementById("base").style.transform = "translate(" + base_transrateX + "px," + base_transrateY + "px)" + " rotate(" + base_rotate + "deg)";
    const right_foot_transrateX = 0;
    const right_foot_transrateY = garad_y_offset;
    const right_foot_rotate = dlt_right_foot_angle + grand_deg;
    document.getElementById("right_foot").style.transform = "translate(" + right_foot_transrateX + "px," + right_foot_transrateY + "px)" + " rotate(" + right_foot_rotate + "deg)";
    const left_foot_transrateX = (Math.cos(Math.PI / 180 * (0 - grand_deg)) - 1) * 50 * mag;
    const left_foot_transrateY = garad_y_offset - Math.sin(Math.PI / 180 * (0 - grand_deg)) * 50 * mag;
    const left_foot_rotate = dlt_left_foot_angle + grand_deg;
    document.getElementById("left_foot").style.transform = "translate(" + left_foot_transrateX + "px," + left_foot_transrateY + "px)" + " rotate(" + left_foot_rotate + "deg)";

    document.getElementById("body2").style.transform = "none";
    document.getElementById("right_leg").style.transform = "rotate(" + dlt_right_leg_angle + "deg)";
    document.getElementById("left_leg").style.transform = "rotate(" + dlt_left_leg_angle + "deg)";

  }

  if (mode == 'right_sole') {

    document.getElementById("base").style.transformOrigin = img_right_foot_base_transform_origin;
    document.getElementById("base").style.transform = "rotate(" + (0 - dlt_right_foot_angle) + "deg)";
    document.getElementById("right_foot").style.transform = "none";
    const left_foot_transrateX = (Math.cos(Math.PI / 180 * dlt_right_foot_angle) - 1) * 50 * mag;
    const left_foot_transrateY = 0 - Math.sin(Math.PI / 180 * dlt_right_foot_angle) * 50 * mag;
    const left_foot_rotate = dlt_left_foot_angle - dlt_right_foot_angle;
    document.getElementById("left_foot").style.transform = "translate(" + left_foot_transrateX + "px," + left_foot_transrateY + "px)" + " rotate(" + left_foot_rotate + "deg)";

    document.getElementById("body2").style.transformOrigin = img_right_leg_body_transform_origin;
    document.getElementById("body2").style.transform = "rotate(" + (0 - dlt_right_leg_angle) + "deg)";
    document.getElementById("right_leg").style.transform = "none";
    const left_leg_transrateX = (Math.cos(Math.PI / 180 * dlt_right_leg_angle) - 1) * 50 * mag;
    const left_leg_transrateY = 0 - Math.sin(Math.PI / 180 * dlt_right_leg_angle) * 50 * mag;
    const left_leg_rotate = dlt_left_leg_angle - dlt_right_leg_angle;
    document.getElementById("left_leg").style.transform = "translate(" + left_leg_transrateX + "px," + left_leg_transrateY + "px)" + " rotate(" + left_leg_rotate + "deg)";

  }

  if (mode == 'left_sole') {

    document.getElementById("base").style.transformOrigin = img_left_foot_base_transform_origin;
    document.getElementById("base").style.transform = "rotate(" + (0 - dlt_left_foot_angle) + "deg)";
    const right_foot_transrateX = (1 - Math.cos(Math.PI / 180 * dlt_left_foot_angle)) * 50 * mag;
    const right_foot_transrateY = Math.sin(Math.PI / 180 * dlt_left_foot_angle) * 50 * mag;
    const right_foot_rotate = dlt_right_foot_angle - dlt_left_foot_angle;
    document.getElementById("right_foot").style.transform = "translate(" + right_foot_transrateX + "px," + right_foot_transrateY + "px)" + " rotate(" + right_foot_rotate + "deg)";
    document.getElementById("left_foot").style.transform = "none";

    document.getElementById("body2").style.transformOrigin = img_left_leg_body_transform_origin;
    document.getElementById("body2").style.transform = "rotate(" + (0 - dlt_left_leg_angle) + "deg)";
    const rignt_leg_transrateX = (1 - Math.cos(Math.PI / 180 * dlt_left_leg_angle)) * 50 * mag;
    const rignt_leg_transrateY = Math.sin(Math.PI / 180 * dlt_left_leg_angle) * 50 * mag;
    const right_leg_rotate = dlt_right_leg_angle - dlt_left_leg_angle;
    document.getElementById("right_leg").style.transform = "translate(" + rignt_leg_transrateX + "px," + rignt_leg_transrateY + "px)" + " rotate(" + right_leg_rotate + "deg)";
    document.getElementById("left_leg").style.transform = "none";

  }

  if (mode == 'body') {

    document.getElementById("base").style.transform = "none";
    document.getElementById("right_foot").style.transform = "rotate(" + dlt_right_foot_angle + "deg)";
    document.getElementById("left_foot").style.transform = "rotate(" + dlt_left_foot_angle + "deg)";

    document.getElementById("body2").style.transform = "none";
    document.getElementById("right_leg").style.transform = "rotate(" + dlt_right_leg_angle + "deg)";
    document.getElementById("left_leg").style.transform = "rotate(" + dlt_left_leg_angle + "deg)";

  }

}
