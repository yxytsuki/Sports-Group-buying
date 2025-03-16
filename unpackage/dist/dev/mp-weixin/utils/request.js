"use strict";
const common_vendor = require("../common/vendor.js");
const instance = common_vendor.axios.create({
  // 后续会根据服务端基地址进行更改
  baseURL: "http://smart-shop.itheima.net/index.php?s=/api",
  timeout: 5e3
});
instance.interceptors.request.use(function(config2) {
  common_vendor.index.showToast({
    title: "加载中...",
    icon: "loading",
    mask: true,
    duration: 1e4
  });
  return config2;
}, function(error) {
  return Promise.reject(error);
});
instance.interceptors.response.use(function(response) {
  const res = response.data;
  if (res.status !== 200) {
    common_vendor.index.showToast({
      title: "服务器开小差啦~",
      icon: "error",
      duration: 2e3
    });
    return Promise.reject("服务器开小差啦~");
  } else {
    common_vendor.index.hideToast();
  }
  return res;
}, function(error) {
  return Promise.reject(error);
});
exports.instance = instance;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
