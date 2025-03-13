"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/order/index.js";
  "./pages/user/index.js";
  "./pages/group/index.js";
  "./pages/details/details.js";
  "./pages/myClass/myClass.js";
  "./pages/pay/pay.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
const Component = () => "./myComponents/component.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("my-component", Component);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
