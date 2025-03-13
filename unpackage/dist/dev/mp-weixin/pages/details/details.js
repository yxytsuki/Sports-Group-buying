"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {}
};
if (!Array) {
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_grid_item2 + _easycom_uni_grid2 + _easycom_uni_icons2)();
}
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_grid_item + _easycom_uni_grid + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.f(4, (item, k0, i0) => {
      return {
        a: common_vendor.t(`第${item}周`),
        b: item,
        c: "2c0884d4-1-" + i0 + ",2c0884d4-0",
        d: common_vendor.p({
          index: item
        })
      };
    }),
    c: common_vendor.p({
      column: 4,
      highlight: true
    }),
    d: common_vendor.f(4, (item, k0, i0) => {
      return {
        a: common_vendor.t(`第${item}周`),
        b: item,
        c: "2c0884d4-3-" + i0 + ",2c0884d4-2",
        d: common_vendor.p({
          index: item
        })
      };
    }),
    e: common_vendor.p({
      column: 4,
      showBorder: false,
      square: false
    }),
    f: common_vendor.f(6, (item, k0, i0) => {
      return {
        a: "2c0884d4-4-" + i0,
        b: item
      };
    }),
    g: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    h: common_vendor.p({
      type: "paperplane",
      size: "36"
    }),
    i: common_vendor.f(7, (item, k0, i0) => {
      return {
        a: item
      };
    }),
    j: common_assets._imports_0,
    k: common_vendor.f(4, (item, k0, i0) => {
      return {
        a: common_vendor.t(`${item}、支付成功即为拼班成功`)
      };
    }),
    l: common_vendor.f(4, (item, k0, i0) => {
      return {
        a: common_vendor.t(`${item}、支付成功即为拼班成功`)
      };
    }),
    m: common_vendor.p({
      type: "undo",
      size: "30"
    }),
    n: common_vendor.p({
      type: "star",
      size: "30"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/details/details.js.map
