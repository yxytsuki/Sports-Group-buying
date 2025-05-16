"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    onunload() {
      clearTimeout(timer);
    },
    jumpNewClass() {
      common_vendor.index.__f__("log", "at pages/group/index.vue:31", store_user.useUserStore().userInfo.is_teacher);
      if (!store_user.useUserStore().userInfo.is_teacher) {
        common_vendor.index.showToast({
          title: "无权限",
          icon: "none",
          mask: true,
          duration: 500
        });
        return;
      }
      common_vendor.index.showToast({
        title: "跳转中...",
        icon: "loading",
        mask: true,
        duration: 500
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/newClass/newClass"
        });
      }, 500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_assets._imports_1$1,
    c: common_vendor.o((...args) => $options.jumpNewClass && $options.jumpNewClass(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/group/index.js.map
