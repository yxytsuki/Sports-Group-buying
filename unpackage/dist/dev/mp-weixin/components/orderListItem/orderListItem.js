"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "orderItem",
  props: {
    orderItem: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var _a, _b, _c, _d;
    return {
      overlap: 20,
      avatarList: [
        "/static/logo.png",
        "/static/logo.png",
        "/static/logo.png"
      ],
      startTime: ((_b = (_a = this.orderItem) == null ? void 0 : _a.time) == null ? void 0 : _b.startTime) || "",
      endTime: ((_d = (_c = this.orderItem) == null ? void 0 : _c.time) == null ? void 0 : _d.endTime) || "",
      timer: null
    };
  },
  computed: {
    getWeeks() {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      const weeks = Math.ceil(diffDays / 7);
      return weeks;
    },
    getButtonTxt() {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!((_c = (_b = (_a = this.orderItem) == null ? void 0 : _a.time) == null ? void 0 : _b.weeks) == null ? void 0 : _c.isRunning)) {
        return "去评价";
      }
      if (!((_d = this.orderItem) == null ? void 0 : _d.isPay) && ((_g = (_f = (_e = this.orderItem) == null ? void 0 : _e.time) == null ? void 0 : _f.weeks) == null ? void 0 : _g.isRunning)) {
        return "去支付";
      }
      return "已支付";
    }
  },
  methods: {
    handleJump(id) {
      if (this.getButtonTxt === "去评价") {
        common_vendor.index.__f__("log", "at components/orderListItem/orderListItem.vue:93", "去评价");
      }
      if (this.getButtonTxt === "去支付") {
        common_vendor.index.showToast({
          title: "跳转中...",
          icon: "loading",
          mask: true,
          duration: 500
        });
        this.timer = setTimeout(() => {
          common_vendor.index.navigateTo({
            url: `/pages/pay/pay?orderId=${id}`
          });
        }, 500);
      }
    }
  },
  onUnload() {
    clearTimeout(this.timer);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  return common_vendor.e({
    a: common_vendor.t((_a = $props.orderItem) == null ? void 0 : _a.title),
    b: common_vendor.t(((_d = (_c = (_b = $props.orderItem) == null ? void 0 : _b.time) == null ? void 0 : _c.weeks) == null ? void 0 : _d.isRunning) ? "拼班中" : "已完成"),
    c: common_vendor.n(((_g = (_f = (_e = $props.orderItem) == null ? void 0 : _e.time) == null ? void 0 : _f.weeks) == null ? void 0 : _g.isRunning) ? "order-title-running" : "order-title-status"),
    d: common_vendor.t(`总周期${$options.getWeeks}周 当前第${(_j = (_i = (_h = $props.orderItem) == null ? void 0 : _h.time) == null ? void 0 : _i.weeks) == null ? void 0 : _j.week}周`),
    e: common_vendor.t((_k = $props.orderItem) == null ? void 0 : _k.orderNumber),
    f: common_vendor.t(`￥${(_l = $props.orderItem) == null ? void 0 : _l.amount}`),
    g: common_vendor.t(`${(_m = $props.orderItem) == null ? void 0 : _m.creatTime}`),
    h: $options.getButtonTxt
  }, $options.getButtonTxt ? {
    i: common_vendor.t($options.getButtonTxt),
    j: common_vendor.o(($event) => {
      var _a2;
      return $options.handleJump((_a2 = $props.orderItem) == null ? void 0 : _a2.orderId);
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/orderListItem/orderListItem.js.map
