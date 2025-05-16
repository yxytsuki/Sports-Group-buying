"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const getCourseDetail = (params) => {
  common_vendor.index.__f__("log", "at api/details.js:5", params);
  return utils_request.request.get("/api/courseDetail", {
    params: {
      ...params
    }
  });
};
const collected = (params) => {
  common_vendor.index.__f__("log", "at api/details.js:15", params);
  return utils_request.request.post("/api/detail_collected", {
    ...params
  });
};
exports.collected = collected;
exports.getCourseDetail = getCourseDetail;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/details.js.map
