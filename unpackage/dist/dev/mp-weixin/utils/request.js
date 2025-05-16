"use strict";
const common_vendor = require("../common/vendor.js");
const store_user = require("../store/user.js");
function createRequest(config = {}) {
  const defaultConfig = {
    baseUrl: "http://192.168.43.38:3000",
    header: {
      "content-type": "application/json"
    },
    dataType: "json",
    token: true
  };
  function requestInterceptor(options) {
    const token = store_user.useUserStore().userInfo.token || "";
    if (options.token && token) {
      options.header = {
        ...options.header,
        Authorization: `Bearer ${token}`
      };
    }
    return options;
  }
  function responseInterceptor(response) {
    if (response.statusCode !== 200) {
      common_vendor.index.showToast({
        title: response.data.desc || `网络错误(${response.statusCode})`,
        icon: "none"
      });
      return Promise.reject(response);
    }
    const resData = response.data;
    if (resData.status !== 200) {
      common_vendor.index.showToast({
        title: resData.desc || "请求失败",
        icon: "none"
      });
      return Promise.reject(resData);
    }
    return resData.data;
  }
  function baseRequest(method, url, data = {}, options = {}) {
    if (method === "GET" && options.params) {
      const queryString = Object.keys(options.params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options.params[key])}`).join("&");
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    const finalOptions = {
      ...defaultConfig,
      ...config,
      ...options,
      url: (config.baseUrl || defaultConfig.baseUrl) + url,
      data,
      method,
      header: {
        ...defaultConfig.header,
        ...config.header || {},
        ...options.header || {}
      },
      token: options.token !== void 0 ? options.token : defaultConfig.token
    };
    const interceptedOptions = requestInterceptor(finalOptions);
    return new Promise((resolve, reject) => {
      common_vendor.index.showLoading({
        title: "加载中",
        mask: true
      });
      common_vendor.index.request({
        ...interceptedOptions,
        success: (result) => {
          common_vendor.index.hideLoading();
          try {
            const data2 = responseInterceptor(result);
            resolve(data2);
          } catch (err) {
            reject(err);
            common_vendor.index.showToast({
              title: err.desc || "出错啦",
              icon: "fail"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "网络开小差啦~",
            icon: "error"
          });
          reject(err);
        }
      });
    });
  }
  return {
    get: (url, options = {}) => baseRequest("GET", url, {}, options),
    post: (url, data = {}, options = {}) => baseRequest("POST", url, data, options),
    put: (url, data = {}, options = {}) => baseRequest("PUT", url, data, options),
    delete: (url, data = {}, options = {}) => baseRequest("DELETE", url, data, options)
  };
}
const request = createRequest();
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
