"use strict";
const utils_request = require("../utils/request.js");
const getLoginCode = () => {
  return utils_request.instance.get("http://127.0.0.1:4523/m1/6035558-5725382-default/getLoginCode");
};
const getLogin = (param) => {
  return utils_request.instance.post("http://127.0.0.1:4523/m1/6035558-5725382-default/getLogin", {
    ...param
  });
};
exports.getLogin = getLogin;
exports.getLoginCode = getLoginCode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/login.js.map
