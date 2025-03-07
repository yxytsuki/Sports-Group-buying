"use strict";
const common_vendor = require("../../common/vendor.js");
const CardItem = () => "../../components/cartItem/cartItem.js";
const _sfc_main = {
  components: {
    CardItem
  },
  data() {
    return {
      title: "hello",
      bannerList: [
        "/static/resource/images/banner/banner1.jpg",
        "/static/resource/images/banner/banner2.jpg",
        "/static/resource/images/banner/banner1.jpg",
        "/static/resource/images/banner/banner2.jpg"
      ],
      tabs: ["小区拼班", "部分拼班动态"],
      positionCurrent: 0,
      items: ["全部", "进行中", "已结束"],
      current: 0,
      courseList: [1, 2, 3, 4, 5]
    };
  },
  methods: {
    onClickItem(e) {
      if (this.current != e.currentIndex) {
        this.current = e.currentIndex;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_cardItem = common_vendor.resolveComponent("cardItem");
  (_easycom_uni_segmented_control2 + _easycom_uni_icons2 + _component_cardItem)();
}
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_segmented_control + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item,
        b: index
      };
    }),
    b: common_vendor.p({
      current: $data.positionCurrent,
      values: $data.tabs,
      ["style-type"]: "text",
      activeColor: "#4cd964"
    }),
    c: common_vendor.p({
      type: "location-filled"
    }),
    d: common_vendor.o($options.onClickItem),
    e: common_vendor.p({
      current: $data.current,
      values: $data.items,
      styleType: "button",
      activeColor: "#4cd964"
    }),
    f: common_vendor.f($data.courseList, (item, index, i0) => {
      return {
        a: "721f2bf6-3-" + i0,
        b: index
      };
    }),
    g: $data.current === 0,
    h: $data.current === 1,
    i: $data.current === 2
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
