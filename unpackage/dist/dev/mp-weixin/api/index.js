"use strict";
const utils_request = require("../utils/request.js");
const getContentList = () => {
  return utils_request.instance.get("https://m1.apifoxmock.com/m1/6035558-5725382-default/getContentList");
};
const getFilterData = (current, positionCurrent) => {
  return utils_request.instance.post("https://m1.apifoxmock.com/m1/6035558-5725382-default/getFilterData", {
    current,
    positionCurrent
  });
};
exports.getContentList = getContentList;
exports.getFilterData = getFilterData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
