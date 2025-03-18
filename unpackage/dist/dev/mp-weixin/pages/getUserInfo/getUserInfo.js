"use strict";
const common_vendor = require("../../common/vendor.js");
const api_login = require("../../api/login.js");
const store_user = require("../../store/user.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      totalSecond: 5,
      second: 5,
      isgetCode: false,
      getCodeTxt: "获取验证码",
      phone: "",
      loginCode: "",
      url: "",
      timer: null
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:55", options);
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  methods: {
    getPhoneNumber(e) {
      this.phone = e;
    },
    codeInput(e) {
      this.loginCode = e;
    },
    clear() {
      this.phone = "";
    },
    validatePhoneNum(phoneNum) {
      const phoneReg = /^1[3-9]\d{9}$/;
      if (phoneReg.test(phoneNum)) {
        return true;
      } else {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return false;
      }
    },
    validateCode(code) {
      const codeReg = /^\d{6}$/;
      if (codeReg.test(code)) {
        return true;
      } else {
        common_vendor.index.showToast({
          title: "请输入正确的验证码",
          icon: "none"
        });
        return false;
      }
    },
    // 倒计时
    async getCode() {
      if (!this.validatePhoneNum(this.phone)) {
        return;
      }
      const {
        data: {
          code
        }
      } = await api_login.getLoginCode();
      common_vendor.index.showModal({
        title: `验证码：${code}`
      });
      this.isgetCode = true;
      if (!this.timer && this.second === this.totalSecond) {
        common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:112", this.isgetCode);
        this.timer = setInterval(() => {
          this.second--;
          if (this.second <= 0) {
            this.isgetCode = false;
            clearInterval(this.timer);
            this.timer = null;
            this.second = this.totalSecond;
          }
        }, 1e3);
      }
    },
    async login() {
      if (!this.validatePhoneNum(this.phone) && !this.validateCode(this.loginCode)) {
        return;
      }
      const {
        data
      } = await api_login.getLogin(this.phone, this.loginCode);
      store_user.useUserStore().setUserInfo(data);
      common_vendor.index.showToast({
        title: "登陆成功",
        icon: "success",
        mask: true,
        duration: 500
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 500);
    }
  }
};
if (!Array) {
  const _component_uni_easyinput = common_vendor.resolveComponent("uni-easyinput");
  _component_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o($options.getPhoneNumber),
    c: common_vendor.o($options.clear),
    d: common_vendor.p({
      type: "number",
      value: "phone",
      maxlength: "11"
    }),
    e: common_vendor.t($data.isgetCode ? `${$data.second}s` : $data.getCodeTxt),
    f: common_vendor.o((...args) => $options.getCode && $options.getCode(...args)),
    g: common_vendor.o($options.codeInput),
    h: common_vendor.p({
      type: "number",
      value: "loginCode",
      maxlength: "6"
    }),
    i: common_vendor.o((...args) => $options.login && $options.login(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/getUserInfo/getUserInfo.js.map
