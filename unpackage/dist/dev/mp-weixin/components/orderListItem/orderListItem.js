"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "orderItem",
  data() {
    return {
      overlap: 20,
      avatarList: [
        "/static/logo.png",
        "/static/logo.png",
        "/static/logo.png"
      ]
    };
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
    a: $data.avatarList.length <= 3
  }, $data.avatarList.length <= 3 ? {
    b: common_vendor.f($data.avatarList, (item, index, i0) => {
      return {
        a: item,
        b: index,
        c: `${25 + index * $data.overlap}px`
      };
    })
  } : {}, {
    c: common_vendor.t(`剩余${$data.avatarList.length}个名额`),
    d: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    e: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    f: common_vendor.p({
      type: "map-pin-ellipse"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/orderListItem/orderListItem.js.map
