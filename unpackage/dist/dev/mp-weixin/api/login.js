"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const getLoginCode = (phone) => {
  return utils_request.request.post("/api/getCode", {
    phone
  });
};
const getLogin = (param) => {
  common_vendor.index.__f__("log", "at api/login.js:11", "参数");
  common_vendor.index.__f__("log", "at api/login.js:12", param);
  return utils_request.request.post("/api/login", {
    ...param
  });
};
const getUser = (userId) => {
  return utils_request.request.get("/api/getUser", {
    params: {
      userId
    }
  });
};
const getlogout = () => {
  return utils_request.request.post("/api/logout");
};
exports.getLogin = getLogin;
exports.getLoginCode = getLoginCode;
exports.getUser = getUser;
exports.getlogout = getlogout;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/login.js.map
