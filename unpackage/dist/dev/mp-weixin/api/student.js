"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const addStudent = (param) => {
  common_vendor.index.__f__("log", "at api/student.js:4", "参数");
  common_vendor.index.__f__("log", "at api/student.js:5", param);
  return utils_request.request.post("/api/addStudent", {
    ...param
  });
};
const getStudentList = (params) => {
  return utils_request.request.get("/api/teacherStudents", {
    params: {
      ...params
    }
  });
};
const teacherStudentDetail = (param) => {
  return utils_request.request.get("/api/teacher/studentDetail", {
    params: {
      ...param
    }
  });
};
const teacherStudent = (param) => {
  return utils_request.request.post("/api/delCourse_student", {
    ...param
  });
};
exports.addStudent = addStudent;
exports.getStudentList = getStudentList;
exports.teacherStudent = teacherStudent;
exports.teacherStudentDetail = teacherStudentDetail;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/student.js.map
