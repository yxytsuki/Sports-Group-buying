"use strict";
const utils_request = require("../utils/request.js");
const getOrderDetail = (param) => {
  return utils_request.request.get("/api/createOrder", {
    params: {
      ...param
    }
  });
};
const getLinkContent = () => {
  return utils_request.request.get("/api/getLinkContent");
};
const checkPay = (param) => {
  return utils_request.request.post("/api/pay", {
    ...param
  });
};
exports.checkPay = checkPay;
exports.getLinkContent = getLinkContent;
exports.getOrderDetail = getOrderDetail;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/pay.js.map
