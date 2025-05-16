"use strict";
const common_vendor = require("../../common/vendor.js");
const api_login = require("../../api/login.js");
const store_user = require("../../store/user.js");
const api_admin = require("../../api/admin.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      totalSecond: 5,
      second: 5,
      isgetCode: false,
      getCodeTxt: "获取验证码",
      phone: "",
      admin: "",
      adminPassword: "",
      loginCode: "",
      url: "",
      timer: null,
      code: "",
      isAdmin: false
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:82", options);
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  methods: {
    getPhoneNumber(e) {
      this.phone = e;
    },
    adminInput(e) {
      this.admin = e;
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:93", this.admin);
    },
    adminPasswordInput(e) {
      this.adminPassword = e;
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:97", this.adminPassword);
    },
    codeInput(e) {
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:101", e);
      this.loginCode = e;
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:103", this.loginCode);
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
      const res = await api_login.getLoginCode(this.phone);
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:140", res);
      this.code = res == null ? void 0 : res.code;
      common_vendor.index.showModal({
        title: `验证码：${res == null ? void 0 : res.code}`
      });
      this.isgetCode = true;
      if (!this.timer && this.second === this.totalSecond) {
        common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:148", this.isgetCode);
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
      if (this.isAdmin) {
        const res2 = await api_admin.adminLogin({
          account: this.admin,
          password: this.adminPassword
        });
        common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:166", res2);
        store_user.useUserStore().setUserInfo(res2);
        common_vendor.index.showToast({
          title: "登陆成功",
          icon: "success",
          mask: true,
          duration: 500
        });
        common_vendor.index.setStorage({
          key: "userInfo",
          data: JSON.stringify(res2)
        });
        this.timer = setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/adminIndex/adminIndex"
          });
        }, 500);
        return;
      }
      if (!this.validatePhoneNum(this.phone) && !this.validateCode(this.loginCode)) {
        return;
      }
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:191", "验证码");
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:192", this.loginCode);
      const res = await api_login.getLogin({
        phone: this.phone,
        code: this.loginCode
      });
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:197", "登录信息");
      common_vendor.index.__f__("log", "at pages/getUserInfo/getUserInfo.vue:198", res);
      store_user.useUserStore().setUserInfo(res);
      common_vendor.index.showToast({
        title: "登陆成功",
        icon: "success",
        mask: true,
        duration: 500
      });
      common_vendor.index.setStorage({
        key: "userInfo",
        data: JSON.stringify(res)
      });
      this.timer = setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/user/index"
        });
      }, 500);
    },
    toggleAdmin() {
      this.isAdmin = !this.isAdmin;
      this.admin = "", this.adminPassword = "", this.phone = "", this.loginCode = "";
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  _easycom_uni_easyinput2();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: !$data.isAdmin
  }, !$data.isAdmin ? {
    c: common_vendor.o($options.getPhoneNumber),
    d: common_vendor.o($options.clear),
    e: common_vendor.p({
      type: "number",
      value: "phone",
      maxlength: "11"
    })
  } : {}, {
    f: $data.isAdmin
  }, $data.isAdmin ? {
    g: common_vendor.o($options.adminInput),
    h: common_vendor.o($options.clear),
    i: common_vendor.o(($event) => $data.admin = $event),
    j: common_vendor.p({
      type: "text",
      maxlength: "11",
      modelValue: $data.admin
    })
  } : {}, {
    k: !$data.isAdmin
  }, !$data.isAdmin ? {
    l: common_vendor.t($data.isgetCode ? `${$data.second}s` : $data.getCodeTxt),
    m: common_vendor.o((...args) => $options.getCode && $options.getCode(...args)),
    n: common_vendor.o($options.codeInput),
    o: common_vendor.p({
      type: "number",
      value: "loginCode",
      maxlength: "6"
    })
  } : {}, {
    p: $data.isAdmin
  }, $data.isAdmin ? {
    q: common_vendor.o($options.adminPasswordInput),
    r: common_vendor.p({
      type: "number",
      value: "adminPassword",
      maxlength: "20"
    })
  } : {}, {
    s: common_vendor.o((...args) => $options.login && $options.login(...args)),
    t: common_vendor.t($data.isAdmin ? "用户登录" : "管理员登录"),
    v: common_vendor.o((...args) => $options.toggleAdmin && $options.toggleAdmin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/getUserInfo/getUserInfo.js.map
