"use strict";
const common_vendor = require("../common/vendor.js");
const Mock = require("mockjs");
function testMock() {
  common_vendor.index.__f__("log", "at mock/testMock.js:3", "mock数据开启");
  const data = Mock.mock("http://yxy.cn/api/getUser", {
    "list|2": [{
      "name|3": "钱学森",
      "age|1-100": 1
    }]
  });
  common_vendor.index.__f__("log", "at mock/testMock.js:10", JSON.stringify(data, null, 4));
}
exports.testMock = testMock;
//# sourceMappingURL=../../.sourcemap/mp-weixin/mock/testMock.js.map
