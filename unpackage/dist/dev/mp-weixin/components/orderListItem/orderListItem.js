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
    var _a, _b, _c;
    return {
      overlap: 20,
      avatarList: [
        "/static/logo.png",
        "/static/logo.png",
        "/static/logo.png"
      ],
      startTime: ((_a = this.orderItem) == null ? void 0 : _a.start_time) || "",
      endTime: ((_b = this.orderItem) == null ? void 0 : _b.end_time) || "",
      timer: null,
      create_time: (_c = this.orderItem) == null ? void 0 : _c.order_createTime
    };
  },
  computed: {
    getWeeks() {
      const diffTime = Math.abs(this.endTime - this.startTime);
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
    // 将毫秒时间戳转化为日期格式
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const Y = date.getFullYear();
      const M = String(date.getMonth() + 1).padStart(2, "0");
      const D = String(date.getDate()).padStart(2, "0");
      const h = String(date.getHours()).padStart(2, "0");
      const m = String(date.getMinutes()).padStart(2, "0");
      const s = String(date.getSeconds()).padStart(2, "0");
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    },
    handleJump(id) {
      if (this.getButtonTxt === "去评价") {
        common_vendor.index.__f__("log", "at components/orderListItem/orderListItem.vue:104", "去评价");
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
    },
    getWeekNumber(startTime, endTime, payTime) {
      const weekMillis = 7 * 24 * 60 * 60 * 1e3;
      if (payTime < startTime || payTime > endTime) {
        return null;
      }
      const diff = payTime - startTime;
      const weekIndex = Math.floor(diff / weekMillis) + 1;
      return weekIndex;
    }
  },
  onUnload() {
    clearTimeout(this.timer);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f;
  return common_vendor.e({
    a: common_vendor.t((_a = $props.orderItem) == null ? void 0 : _a.title),
    b: common_vendor.t((_b = $props.orderItem) == null ? void 0 : _b.status),
    c: common_vendor.n(((_c = $props.orderItem) == null ? void 0 : _c.status) === "拼班中" ? "order-title-running" : "order-title-status"),
    d: common_vendor.t(`总周期${$options.getWeeks}周 当前第${$options.getWeekNumber($data.startTime, $data.endTime, (_d = $props.orderItem) == null ? void 0 : _d.pay_time)}周`),
    e: common_vendor.t((_e = $props.orderItem) == null ? void 0 : _e.order_number),
    f: common_vendor.t(`￥${(_f = $props.orderItem) == null ? void 0 : _f.amount}`),
    g: common_vendor.t($options.formatTimestamp($data.create_time)),
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
