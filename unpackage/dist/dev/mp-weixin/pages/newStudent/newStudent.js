"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_modeEnum = require("../../utils/modeEnum.js");
const api_admin = require("../../api/admin.js");
const api_student = require("../../api/student.js");
const _sfc_main = {
  data() {
    return {
      tempAvatarPath: "",
      //存放头像临时路径
      formData: {
        stuId: "",
        nickName: "",
        personDesc: "",
        password: "",
        confirmPassword: "",
        avatar: "",
        amount: "",
        isshowError: false,
        isconfirm: false,
        isdisabled: false,
        isshowDetail: false
      },
      rules: {
        nickName: {
          rules: [
            {
              "required": false,
              errorMessage: "请输入昵称"
            },
            {
              maxLength: 10,
              errorMessage: "昵称最多不超过10字符"
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
  async onLoad(options) {
    common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:115", options);
    common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:116", "mode", options.mode);
    if (utils_modeEnum.MODEENUM.MODIFY === options.mode || utils_modeEnum.MODEENUM.MODIFY === options.mode) {
      const res = await api_admin.adminGetStudentDetail({
        user_id: options.user_id
      });
      common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:121", res);
      this.formData.stuId = options.user_id;
      this.formData.nickName = res.nickName;
      this.formData.personDesc = res.description || "";
      this.formData.amount = res.amount;
    }
  },
  methods: {
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        //允许选择1张照片
        sizeType: ["compressed"],
        //压缩图片
        sourceType: ["album", "camera"],
        //可从相册或相机选择
        success: (res) => {
          const tempPath = res.tempFilePaths[0];
          this.tempAvatarPath = tempPath;
          common_vendor.index.uploadFile({
            url: "http://localhost:3000/api/upload",
            // 改成你后台实际上传接口
            filePath: tempPath,
            name: "avatar",
            // 后端接收的字段名
            success: (uploadRes) => {
              const responseData = JSON.parse(uploadRes.data);
              if (responseData.status === 200) {
                this.formData.avatar = `http://localhost:3000${responseData.url}`;
                common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:151", "真实路径");
                common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:152", this.formData.avatar);
                common_vendor.index.showToast({
                  title: "上传成功",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({
                  title: "上传失败",
                  icon: "error"
                });
              }
            },
            fail: () => {
              common_vendor.index.showToast({
                title: "上传失败",
                icon: "error"
              });
            }
          });
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
        common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:200", "表单数据", this.formData);
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        common_vendor.index.navigateTo({
          url: "pages/myClass/myClass"
        });
      }).catch((err) => {
        common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:209", "表单错误", err);
      });
    },
    async submitForm() {
      try {
        await this.$refs.form.validate();
        const res = await api_student.addStudent({
          user_id: this.user_id,
          user_name: this.formData.userName,
          nickName: this.formData.nickName,
          avatar: this.formData.avatar,
          password: this.formData.password,
          description: this.formData.personDesc
        });
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:229", "结果");
        this.timer = setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/adminStudent/adminStudent"
          });
        }, 500);
      } catch (err) {
        common_vendor.index.__f__("log", "at pages/newStudent/newStudent.vue:237", "表单错误", err);
      }
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
    a: common_vendor.o(($event) => $data.formData.stuId = $event),
    b: common_vendor.p({
      maxlength: "10",
      placeholder: "请输入学员id",
      modelValue: $data.formData.stuId
    }),
    c: common_vendor.p({
      label: "学员id",
      name: "stuId",
      required: "true"
    }),
    d: common_vendor.o(($event) => $data.formData.nickName = $event),
    e: common_vendor.p({
      maxlength: "20",
      placeholder: "请输入学员昵称",
      modelValue: $data.formData.nickName
    }),
    f: common_vendor.p({
      label: "昵称",
      name: "nickName"
    }),
    g: $data.formData.avatar
  }, $data.formData.avatar ? {
    h: $data.formData.avatar
  } : {
    i: common_vendor.t($data.formData.avatar ? "更换图片" : "上传图片"),
    j: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  }, {
    k: common_vendor.p({
      label: "学员头像",
      name: "avatar"
    }),
    l: common_vendor.o($options.handleInputPassword),
    m: common_vendor.o(($event) => $data.formData.password = $event),
    n: common_vendor.p({
      maxlength: "6",
      type: "password",
      placeholder: "请输入学员支付密码",
      modelValue: $data.formData.password
    }),
    o: _ctx.isshowError
  }, _ctx.isshowError ? {} : {}, {
    p: common_vendor.p({
      label: "支付密码",
      name: "password",
      required: "true"
    }),
    q: common_vendor.o($options.handleInputPassword),
    r: common_vendor.o(($event) => $data.formData.amount = $event),
    s: common_vendor.p({
      placeholder: "请输入学员余额",
      modelValue: $data.formData.amount
    }),
    t: _ctx.isshowError
  }, _ctx.isshowError ? {} : {}, {
    v: common_vendor.p({
      label: "余额",
      name: "amount",
      required: "true"
    }),
    w: common_vendor.o(($event) => $data.formData.personDesc = $event),
    x: common_vendor.p({
      type: "textarea",
      placeholder: "请输入学员介绍",
      modelValue: $data.formData.personDesc
    }),
    y: common_vendor.p({
      label: "学员介绍",
      name: "personDesc"
    }),
    z: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    A: common_vendor.sr("form", "9e238620-0"),
    B: common_vendor.p({
      modelValue: $data.formData
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/newStudent/newStudent.js.map
