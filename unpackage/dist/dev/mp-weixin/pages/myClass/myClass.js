"use strict";
const common_vendor = require("../../common/vendor.js");
const classListItem = () => "../../components/classListItem/classListItem.js";
const _sfc_main = {
  components: {
    classListItem
  },
  data() {
    return {
      overlap: 20,
      avatarList: [
        "/static/logo.png",
        "/static/logo.png",
        "/static/logo.png"
      ]
    };
  },
  methods: {}
};
if (!Array) {
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_classListItem2 = common_vendor.resolveComponent("classListItem");
  (_easycom_uni_segmented_control2 + _easycom_classListItem2)();
}
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_classListItem = () => "../../components/classListItem/classListItem.js";
if (!Math) {
  (_easycom_uni_segmented_control + _easycom_classListItem)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      current: _ctx.current,
      values: _ctx.filterTabs,
      ["style-type"]: "text",
      activeColor: "#4cd964"
    }),
    b: common_vendor.f(_ctx.orderItem, (item, index, i0) => {
      return {
        a: "2920192c-1-" + i0,
        b: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/myClass/myClass.js.map
