"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const getFilterData = (current, positionCurrent) => {
  common_vendor.index.__f__("log", "at api/index.js:9", current, positionCurrent);
  return utils_request.request.get("/api/index_list/filterdata", {
    params: {
      current,
      positionCurrent
    }
  });
};
exports.getFilterData = getFilterData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
