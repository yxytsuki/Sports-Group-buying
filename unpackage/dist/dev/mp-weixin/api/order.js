"use strict";
const utils_request = require("../utils/request.js");
const getOrderList = () => {
  return utils_request.instance.get("http://127.0.0.1:4523/m1/6035558-5725382-default/getOrderList");
};
const getFilterOrder = (current) => {
  return utils_request.instance.get("http://127.0.0.1:4523/m1/6035558-5725382-default/getFilterOrder", {
    params: {
      current
    }
  });
};
exports.getFilterOrder = getFilterOrder;
exports.getOrderList = getOrderList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/order.js.map
