"use strict";
const utils_request = require("../utils/request.js");
const getCourseDetail = (id) => {
  return utils_request.instance.post(`http://127.0.0.1:4523/m1/6035558-5725382-default/getCourseDetail?courseId=${id}`);
};
const collected = (id, iscollected) => {
  return utils_request.instance.get(
    `http://127.0.0.1:4523/m1/6035558-5725382-default/collected?id=${id}&isCollected=${iscollected}`
  );
};
exports.collected = collected;
exports.getCourseDetail = getCourseDetail;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/details.js.map
