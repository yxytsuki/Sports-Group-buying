"use strict";
const utils_request = require("../utils/request.js");
const getPicCode = () => {
  return utils_request.instance.post("/captcha/image");
};
exports.getPicCode = getPicCode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/login.js.map
