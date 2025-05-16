"use strict";
const common_vendor = require("../../common/vendor.js");
const api_pay = require("../../api/pay.js");
const store_user = require("../../store/user.js");
const utils_getUserInfo = require("../../utils/getUserInfo.js");
const _sfc_main = {
  data() {
    return {
      orderDetail: [],
      startTime: "",
      endTime: "",
      now: 0,
      studentsNumber: 0,
      ischecked: false,
      isvisible: false,
      linkContent: "",
      password: "",
      timer: null,
      isclosed: true,
      isshowError: false,
      user_id: store_user.useUserStore().userInfo.user_id
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/pay/pay.vue:118", Object.keys(options)[0]);
    if (Object.keys(options)[0] === "courseId") {
      this.getCreateOrder(options.courseId);
    }
    const {
      isLogin
    } = utils_getUserInfo.useAuth();
    if (!isLogin()) {
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:130", "未登录，已跳转");
    } else {
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:132", "已登录，继续执行业务逻辑");
    }
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  computed: {
    // 计算属性的getter
    getWeeks() {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      const weeks = Math.ceil(diffDays / 7);
      return weeks;
    }
  },
  methods: {
    formatFullTime(ts) {
      const date = new Date(Number(ts));
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const d = date.getDate().toString().padStart(2, "0");
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      return `${y}/${m}/${d} ${h}:${min}`;
    },
    getNow(startTime, endTime) {
      const now = Date.now();
      startTime = Number(startTime);
      endTime = Number(endTime);
      if (now < startTime) {
        return 0;
      }
      if (now > endTime) {
        return Math.ceil((endTime - startTime) / (7 * 24 * 60 * 60 * 1e3));
      }
      const diff = now - startTime;
      const weekMs = 7 * 24 * 60 * 60 * 1e3;
      const week = Math.ceil(diff / weekMs);
      return week;
    },
    async getCreateOrder(courseId) {
      var _a, _b, _c, _d, _e;
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:179", courseId);
      const data = await api_pay.getOrderDetail({
        courseId,
        userId: this.user_id
      });
      this.orderDetail = data;
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:185", data);
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:186", (_a = data == null ? void 0 : data.time) == null ? void 0 : _a.startTime);
      this.startTime = this.formatFullTime((_b = data == null ? void 0 : data.time) == null ? void 0 : _b.startTime);
      this.endTime = this.formatFullTime((_c = data == null ? void 0 : data.time) == null ? void 0 : _c.endTime);
      this.now = this.getNow((_d = data == null ? void 0 : data.time) == null ? void 0 : _d.startTime, (_e = data == null ? void 0 : data.time) == null ? void 0 : _e.endTime);
      this.studentsNumber = data == null ? void 0 : data.students.length;
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:191", this.studentsNumber);
    },
    toggleChecked() {
      this.ischecked = !this.ischecked;
    },
    async showLink(type) {
      const data = await api_pay.getLinkContent();
      this.linkContent = data.content;
      this.msgType = type;
      this.$refs.alertDialog.open();
    },
    dialogConfirm() {
      this.ischecked = true;
    },
    dialogClose() {
      this.$refs.inputDialog.close();
    },
    confirmPay() {
      if (!this.ischecked) {
        this.showLink();
        return;
      }
      this.$refs.inputDialog.open();
    },
    async dialogInputConfirm() {
      var _a;
      const data = await api_pay.checkPay({
        orderId: (_a = this.orderDetail) == null ? void 0 : _a.orderId,
        payPassword: this.password
      });
      if (data == null ? void 0 : data.isTrade) {
        common_vendor.index.showToast({
          title: "支付成功",
          icon: "success",
          mask: true,
          duration: 200
        });
        this.isclosed = false;
        this.password = "";
        this.$refs.inputDialog.close();
        this.timer = setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/order/index"
          });
        }, 500);
      } else {
        common_vendor.index.showToast({
          title: "密码错误，请重试",
          icon: "error",
          mask: true,
          duration: 500
        });
        this.password = "";
      }
    },
    getPassword(e) {
      this.isvalidator(e.detail.value);
      if (e.detail.value.length === 6) {
        this.password = e.detail.value;
      }
    },
    isvalidator(password) {
      const regex = /^\d{6}$/;
      if (!regex.test(password)) {
        this.isshowError = true;
      } else {
        this.isshowError = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup_dialog + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b;
  return {
    a: common_vendor.t($data.orderDetail.title),
    b: common_vendor.t(`总周期${$options.getWeeks}期，当前第${$data.now}周`),
    c: common_vendor.t(`剩余${((_a = $data.orderDetail) == null ? void 0 : _a.totalNumber) - $data.studentsNumber}名额拼满`),
    d: common_vendor.t($options.formatFullTime((_b = $data.orderDetail) == null ? void 0 : _b.creatTime)),
    e: common_vendor.p({
      type: "location",
      size: "24"
    }),
    f: common_vendor.t($data.orderDetail.adress),
    g: common_vendor.t($data.orderDetail.title),
    h: $data.ischecked,
    i: common_vendor.o((...args) => $options.toggleChecked && $options.toggleChecked(...args)),
    j: common_vendor.o(($event) => $options.showLink("info")),
    k: common_vendor.o($options.dialogConfirm),
    l: common_vendor.o($options.dialogClose),
    m: common_vendor.p({
      type: _ctx.msgType,
      cancelText: "关闭",
      confirmText: "同意",
      title: "跃动星球协议",
      content: $data.linkContent
    }),
    n: common_vendor.sr("alertDialog", "83de883c-1"),
    o: common_vendor.p({
      type: "dialog"
    }),
    p: common_vendor.o((...args) => $options.confirmPay && $options.confirmPay(...args)),
    q: common_vendor.w((value, s0, i0) => {
      return common_vendor.e($data.isshowError ? {} : {}, {
        a: i0,
        b: s0
      });
    }, {
      name: "d",
      path: "q",
      vueId: "83de883c-4,83de883c-3"
    }),
    r: common_vendor.o((...args) => $options.getPassword && $options.getPassword(...args)),
    s: $data.password,
    t: $data.isshowError,
    v: common_vendor.sr("inputClose", "83de883c-4,83de883c-3"),
    w: common_vendor.o($options.dialogInputConfirm),
    x: common_vendor.o($options.dialogClose),
    y: common_vendor.p({
      mode: "input",
      title: "输入密码",
      placeholder: "请输入密码",
      ["before-close"]: $data.isclosed
    }),
    z: common_vendor.sr("inputDialog", "83de883c-3"),
    A: common_vendor.p({
      type: "dialog"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pay/pay.js.map
