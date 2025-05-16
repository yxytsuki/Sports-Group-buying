"use strict";
const utils_request = require("../utils/request.js");
const adminLogin = (param) => {
  return utils_request.request.post("/api/admin/login", {
    ...param
  });
};
const admindelStudent = (param) => {
  return utils_request.request.post("/api/admin/deleteStudent", {
    ...param
  });
};
const adminGetStudent = (param) => {
  return utils_request.request.get("/api/admin/getStudents", {
    params: param
  });
};
const adminGetStudentDetail = (param) => {
  return utils_request.request.get("/api/admin/getStudentDetail", {
    params: param
  });
};
exports.adminGetStudent = adminGetStudent;
exports.adminGetStudentDetail = adminGetStudentDetail;
exports.adminLogin = adminLogin;
exports.admindelStudent = admindelStudent;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/admin.js.map
