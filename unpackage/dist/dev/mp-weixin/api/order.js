"use strict";
const utils_request = require("../utils/request.js");
const getFilterOrder = (param) => {
  return utils_request.request.get("/api/getFilterOrder", {
    params: {
      ...param
    }
  });
};
exports.getFilterOrder = getFilterOrder;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/order.js.map
