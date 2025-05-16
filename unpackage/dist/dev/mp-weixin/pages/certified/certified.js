"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        nickName: "",
        personDesc: "",
        password: "",
        confirmPassword: "",
        avatar: "",
        isshowError: false,
        isconfirm: false
      },
      rules: {
        nickName: {
          rules: [
            {
              "required": false,
              errorMessage: "请输入昵称"
            },
            {
              maxLength: 20,
              errorMessage: "课程名称最多不超过20字符"
            }
          ]
        },
        personDesc: {
          rules: [{
            required: false,
            errorMessage: "请输入个人介绍"
          }]
        },
        password: {
          rules: [
            {
              required: false,
              errorMessage: "请输入支付密码"
            },
            {
              maxLength: 6,
              errorMessage: "密码最多不超过6字符"
            }
          ]
        }
      }
    };
  },
  methods: {
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.formData.avatar = res.tempFilePaths[0];
        }
      });
    },
    // 密码校验
    isvalidator(password) {
      const regex = /^\d{6}$/;
      if (!regex.test(password)) {
        this.isshowError = true;
      } else {
        this.isshowError = false;
      }
    },
    isvalidatorConfirmPassword(password) {
      if (password !== this.formData.password) {
        this.isconfirm = true;
      } else {
        this.isconfirm = false;
      }
    },
    // 输入
    handleInputPassword(e) {
      this.isvalidator(e);
    },
    handleInput(e) {
      this.isvalidatorConfirmPassword(e);
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate().then((res) => {
        common_vendor.index.__f__("log", "at pages/certified/certified.vue:133", "表单数据", this.formData);
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        common_vendor.index.navigateTo({
          url: "pages/myClass/myClass"
        });
      }).catch((err) => {
        common_vendor.index.__f__("log", "at pages/certified/certified.vue:142", "表单错误", err);
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.formData.nickName = $event),
    b: common_vendor.p({
      placeholder: "请输入昵称",
      modelValue: $data.formData.nickName
    }),
    c: common_vendor.p({
      label: "昵称",
      name: "nickName"
    }),
    d: $data.formData.avatar
  }, $data.formData.avatar ? {
    e: $data.formData.avatar
  } : {
    f: common_vendor.t($data.formData.avatar ? "更换图片" : "上传图片"),
    g: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  }, {
    h: common_vendor.p({
      label: "头像",
      name: "avatar"
    }),
    i: common_vendor.o($options.handleInputPassword),
    j: common_vendor.o(($event) => $data.formData.password = $event),
    k: common_vendor.p({
      maxlength: "6",
      type: "password",
      placeholder: "请输入支付密码",
      modelValue: $data.formData.password
    }),
    l: _ctx.isshowError
  }, _ctx.isshowError ? {} : {}, {
    m: common_vendor.p({
      label: "支付密码",
      name: "password"
    }),
    n: common_vendor.o($options.handleInput),
    o: common_vendor.o(($event) => $data.formData.confirmPassword = $event),
    p: common_vendor.p({
      maxlength: "6",
      type: "password",
      placeholder: "请输入确认支付密码",
      modelValue: $data.formData.confirmPassword
    }),
    q: _ctx.isconfirm
  }, _ctx.isconfirm ? {} : {}, {
    r: common_vendor.p({
      label: "确认支付密码",
      name: "password"
    }),
    s: common_vendor.o(($event) => $data.formData.personDesc = $event),
    t: common_vendor.p({
      type: "textarea",
      placeholder: "请输入个人介绍",
      modelValue: $data.formData.personDesc
    }),
    v: common_vendor.p({
      label: "个人介绍",
      name: "personDesc"
    }),
    w: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    x: common_vendor.sr("form", "29ad3660-0"),
    y: common_vendor.p({
      modelValue: $data.formData
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/certified/certified.js.map
