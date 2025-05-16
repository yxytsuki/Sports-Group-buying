"use strict";
const utils_request = require("../utils/request.js");
const getCollectedCourse = (param) => {
  return utils_request.request.post("/api/getCollectCourse", {
    ...param
  });
};
exports.getCollectedCourse = getCollectedCourse;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/collected.js.map
