"use strict";
const common_vendor = require("../../common/vendor.js");
const api_pay = require("../../api/pay.js");
const store_user = require("../../store/user.js");
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
      isshowError: false
    };
  },
  onLoad(options) {
    this.getContentList(options);
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
    async getContentList(param) {
      var _a, _b, _c;
      const res = await api_pay.getOrderDetail(param);
      const {
        data
      } = res;
      this.orderDetail = data;
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:137", data);
      this.startTime = (_a = data == null ? void 0 : data.time) == null ? void 0 : _a.startTime;
      this.endTime = (_b = data == null ? void 0 : data.time) == null ? void 0 : _b.endTime;
      this.now = (_c = data == null ? void 0 : data.time) == null ? void 0 : _c.weeks.now;
      this.studentsNumber = data == null ? void 0 : data.students.length;
      common_vendor.index.__f__("log", "at pages/pay/pay.vue:142", this.studentsNumber);
    },
    toggleChecked() {
      this.ischecked = !this.ischecked;
    },
    async showLink(type) {
      const {
        data
      } = await api_pay.getLinkContent();
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
      const {
        data
      } = await api_pay.checkPay(this.orderDetail.amount, this.password, store_user.useUserStore().userInfo.userId);
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
    d: common_vendor.t((_b = $data.orderDetail) == null ? void 0 : _b.creatTime),
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
