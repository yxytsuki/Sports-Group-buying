"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const createCourse = (param) => {
  common_vendor.index.__f__("log", "at api/teacher.js:3", param);
  return utils_request.request.post("/api/createCourse", {
    ...param
  });
};
const insertWeek = (param) => {
  common_vendor.index.__f__("log", "at api/teacher.js:9", "参数");
  common_vendor.index.__f__("log", "at api/teacher.js:10", param);
  return utils_request.request.post("/api/courseWeek", {
    ...param
  });
};
const getTeacherIncome = (param) => {
  return utils_request.request.get("/api/teacherIncomeDetail", {
    params: param
  });
};
const getMyClass = (param) => {
  common_vendor.index.__f__("log", "at api/teacher.js:21", "参数", param);
  return utils_request.request.get("/api/myClass", {
    params: param
  });
};
exports.createCourse = createCourse;
exports.getMyClass = getMyClass;
exports.getTeacherIncome = getTeacherIncome;
exports.insertWeek = insertWeek;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/teacher.js.map
