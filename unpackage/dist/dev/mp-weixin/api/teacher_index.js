"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const getTeacherIncome = (param) => {
  common_vendor.index.__f__("log", "at api/teacher_index.js:5", "参数", param);
  return utils_request.request.get("/api/teacherIncome", {
    params: param
  });
};
exports.getTeacherIncome = getTeacherIncome;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/teacher_index.js.map
