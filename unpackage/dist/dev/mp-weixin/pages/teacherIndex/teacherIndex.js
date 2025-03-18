"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    handleVisible() {
      this.$data.isVisible = !this.$data.isVisible;
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "location-filled",
      size: "30"
    }),
    b: common_assets._imports_0$1,
    c: common_assets._imports_0,
    d: $data.isVisible
  }, $data.isVisible ? {
    e: common_vendor.o((...args) => $options.handleVisible && $options.handleVisible(...args))
  } : {}, {
    f: !$data.isVisible
  }, !$data.isVisible ? {
    g: common_vendor.o((...args) => $options.handleVisible && $options.handleVisible(...args))
  } : {}, {
    h: $data.isVisible
  }, $data.isVisible ? {} : {}, {
    i: !$data.isVisible
  }, !$data.isVisible ? {} : {}, {
    j: common_vendor.p({
      type: "wallet-filled",
      size: "30"
    }),
    k: common_vendor.p({
      type: "wallet-filled",
      size: "30"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/teacherIndex/teacherIndex.js.map
