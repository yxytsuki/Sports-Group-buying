"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isLogin: false,
      timer: null
    };
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  methods: {
    handleLogin() {
      const token = store_user.useUserStore().token;
      if (!token) {
        common_vendor.index.showToast({
          title: "跳转中...",
          icon: "loading",
          mask: true,
          duration: 500
        });
        this.timer = setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/getUserInfo/getUserInfo"
          });
        }, 500);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.t($data.isLogin ? "昵称" : "立即登录"),
    c: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    d: common_vendor.f(7, (item, k0, i0) => {
      return {
        a: item
      };
    }),
    e: common_assets._imports_0
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
