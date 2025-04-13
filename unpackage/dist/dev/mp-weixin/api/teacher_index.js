"use strict";
const utils_request = require("../utils/request.js");
const getTeacherIndex = () => {
  return utils_request.instance.get("http://127.0.0.1:4523/m1/6035558-5725382-default/getTeacherIndex");
};
exports.getTeacherIndex = getTeacherIndex;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/teacher_index.js.map
