"use strict";
const common_vendor = require("../../common/vendor.js");
const orderListItem = () => "../../components/orderListItem/orderListItem.js";
const _sfc_main = {
  components: {
    orderListItem
  },
  data() {
    return {
      filterTabs: ["待支付", "拼班中", "已完成"],
      current: 0,
      orderItem: [1, 2, 3, 4, 5, 6]
    };
  },
  methods: {}
};
if (!Array) {
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_orderListItem2 = common_vendor.resolveComponent("orderListItem");
  (_easycom_uni_segmented_control2 + _easycom_orderListItem2)();
}
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_orderListItem = () => "../../components/orderListItem/orderListItem.js";
if (!Math) {
  (_easycom_uni_segmented_control + _easycom_orderListItem)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      current: $data.current,
      values: $data.filterTabs,
      ["style-type"]: "text",
      activeColor: "#4cd964"
    }),
    b: common_vendor.f($data.orderItem, (item, index, i0) => {
      return {
        a: "d142c11c-1-" + i0,
        b: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/index.js.map
