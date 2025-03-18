"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    course: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  name: "cartItem",
  data() {
    return {
      timer: null,
      isButton: true
    };
  },
  methods: {
    jumpPay(id) {
      if (this.course.isRunning) {
        common_vendor.index.__f__("log", "at components/cartItem/cartItem.vue:60", id);
        common_vendor.index.showToast({
          title: "跳转中...",
          icon: "loading",
          mask: true,
          duration: 500
        });
        this.timer = setTimeout(() => {
          common_vendor.index.navigateTo({
            url: `/pages/pay/pay?courseId=${id}`
          });
        }, 500);
      }
    },
    jumpDetails(id) {
      common_vendor.index.__f__("log", "at components/cartItem/cartItem.vue:76", id);
      if (this.course.isRunning) {
        common_vendor.index.showToast({
          title: "跳转中...",
          icon: "loading",
          mask: true,
          duration: 500
        });
        this.timer = setTimeout(() => {
          common_vendor.index.navigateTo({
            url: `/pages/details/details?id=${id}`
          });
        }, 500);
      }
    }
  },
  destroyed() {
    common_vendor.index.__f__("log", "at components/cartItem/cartItem.vue:94", 11);
    clearTimeout(this.timer);
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
  var _a, _b, _c, _d, _e, _f;
  return common_vendor.e({
    a: !$props.course.isRunning
  }, !$props.course.isRunning ? {} : {}, {
    b: $props.course.backgroundImage,
    c: common_vendor.t($props.course.title),
    d: common_vendor.t(`${$props.course.distance}km`),
    e: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    f: common_vendor.t($props.course.address),
    g: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    h: common_vendor.t(`${(_b = (_a = $props.course) == null ? void 0 : _a.time) == null ? void 0 : _b.day}:${(_d = (_c = $props.course) == null ? void 0 : _c.time) == null ? void 0 : _d.startTime}~${(_f = (_e = $props.course) == null ? void 0 : _e.time) == null ? void 0 : _f.endTime}`),
    i: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    j: common_vendor.t(`班级号${$props.course.classNumber}`),
    k: common_vendor.t(`满${$props.course.totalNumber}成班`),
    l: common_vendor.t(`0/${$props.course.totalNumber}`),
    m: common_vendor.o(($event) => $options.jumpPay($props.course.cardItemId)),
    n: common_vendor.o(($event) => $options.jumpDetails($props.course.cardItemId))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/cartItem/cartItem.js.map
