"use strict";
const utils_request = require("../utils/request.js");
const getOrderDetail = (param) => {
  return utils_request.instance.get("http://127.0.0.1:4523/m1/6035558-5725382-default/getOrderDetail", {
    params: {
      ...param
    }
  });
};
const getLinkContent = () => {
  return utils_request.instance.get("http://127.0.0.1:4523/m1/6035558-5725382-default/getLinkContent");
};
const checkPay = (coursePrice, password, userId) => {
  return utils_request.instance.get(
    `http://127.0.0.1:4523/m1/6035558-5725382-default/checkPay?coursePrice=${coursePrice}&password=${password}&userId=${userId}`
  );
};
exports.checkPay = checkPay;
exports.getLinkContent = getLinkContent;
exports.getOrderDetail = getOrderDetail;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/pay.js.map
