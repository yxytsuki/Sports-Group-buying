"use strict";
const common_vendor = require("../../common/vendor.js");
const api_teacher = require("../../api/teacher.js");
const store_user = require("../../store/user.js");
const _sfc_main = {
  data() {
    return {
      weekDays: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      selectedStartTime: [],
      // 级联选择值
      timeData: [
        {
          label: "时",
          value: "hour"
        },
        {
          label: "分",
          value: "minute"
        },
        {
          label: "秒",
          value: "second"
        }
      ],
      formData: {
        courseName: "",
        courseDesc: "",
        location: "",
        detailLocation: "",
        coverImage: "",
        price: "",
        courseNote: "",
        capacity: "",
        startDate: "",
        endDate: "",
        weekDays: [],
        dailyStartTime: "",
        dailyEndTime: ""
      },
      rules: {
        courseName: {
          rules: [
            {
              "required": true,
              errorMessage: "请输入团课名称"
            },
            {
              maxLength: 20,
              errorMessage: "课程名称最多不超过20字符"
            }
          ]
        },
        courseDesc: {
          rules: [{
            required: true,
            errorMessage: "请输入课程介绍"
          }]
        },
        location: {
          rules: [{
            required: true,
            errorMessage: "请输入课程地点"
          }]
        },
        detailLocation: {
          rules: [{
            required: true,
            errorMessage: "请输入课程详细地点"
          }]
        },
        coverImage: {
          rules: [{
            required: true,
            errorMessage: "请上传课程背景"
          }]
        },
        price: {
          rules: [
            {
              required: true,
              errorMessage: "请输入课程价格"
            },
            {
              validateFunction: (rule, value, data, callback) => {
                if (value === "" || value === null || value === void 0) {
                  callback();
                  return;
                }
                if (Number(value) < 0) {
                  callback("价格不能为负数");
                  return;
                }
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                  callback("价格最多保留两位小数");
                  return;
                }
                callback();
              }
            }
          ]
        },
        capacity: {
          rules: [{
            required: true,
            errorMessage: "请输入课程容量"
          }]
        },
        startDate: {
          rules: [
            {
              required: true,
              errorMessage: "请输入课程开始日期"
            },
            {
              validateFunction: (rule, value, data, callback) => {
                if (this.formData.startDate && this.formData.endDate && new Date(this.formData.startDate) > new Date(this.formData.endDate)) {
                  callback("开始日期不能晚于结束日期");
                } else {
                  callback();
                }
              }
            }
          ]
        },
        endDate: {
          rules: [{
            required: true,
            errorMessage: "请输入课程结束日期"
          }]
        },
        weekDays: {
          rules: [{
            required: true,
            errorMessage: "请选择上课时间"
          }]
        },
        dailyStartTime: {
          rules: [
            {
              required: true,
              errorMessage: "请选择开始时间"
            },
            {
              validateFunction: (rule, value, data, callback) => {
                if (this.formData.dailyStartTime && this.formData.dailyEndTime && new Date(this.formData.dailyStartTime) > new Date(this.formData.dailyEndTime)) {
                  callback("开始时间不能晚于结束日期");
                } else {
                  callback();
                }
              }
            }
          ]
        },
        dailyEndTime: {
          rules: [{
            required: true,
            errorMessage: "请选择结束时间"
          }]
        }
      }
    };
  },
  computed: {
    displayTime() {
      common_vendor.index.__f__("log", "at pages/newClass/newClass.vue:261", this.selectedStartTime);
      if (this.selectedStartTime && this.selectedStartTime.length === 3) {
        this.formData.dailyStartTime = this.selectedStartTime.join(":");
      }
    }
  },
  methods: {
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.formData.coverImage = res.tempFilePaths[0];
        }
      });
    },
    // 切换周几
    toggleWeekDay(index) {
      const weekDayIndex = this.formData.weekDays.indexOf(index);
      if (weekDayIndex === -1) {
        this.formData.weekDays.push(index);
      } else {
        this.formData.weekDays.splice(weekDayIndex, 1);
      }
      this.formData.weekDays.sort();
    },
    // 时间转换
    handleTimeChange(e) {
      if (e.detail.value.length === 3) {
        const [hour, minute, second] = e.detail.value;
        this.formData.dailyStartTime = `${hour}:${minute}:${second}`;
      }
    },
    // 提交表单
    async submitForm() {
      try {
        await this.$refs.form.validate();
        common_vendor.index.__f__("log", "at pages/newClass/newClass.vue:302", "表单数据", this.formData);
        common_vendor.index.__f__("log", "at pages/newClass/newClass.vue:303", JSON.parse(JSON.stringify(this.formData)));
        const res = await api_teacher.createCourse({
          teacher_id: store_user.useUserStore().userInfo.user_id,
          teacher_name: store_user.useUserStore().userInfo.nickName,
          ...this.formData
        });
        common_vendor.index.__f__("log", "at pages/newClass/newClass.vue:311", "创建成功", res);
        common_vendor.index.showToast({
          icon: "success",
          title: "创建成功"
        });
        const data = await api_teacher.insertWeek({
          course_id: res.course_id,
          startDate: this.formData.startDate,
          endDate: this.formData.endDate,
          dailyStartTime: this.formData.dailyStartTime,
          dailyEndTime: this.formData.dailyEndTime,
          weekDays: this.formData.weekDays
        });
        common_vendor.index.__f__("log", "at pages/newClass/newClass.vue:325", data);
        common_vendor.index.showToast({
          icon: "success",
          title: "发布成功"
        });
        this.timer = setTimeout(() => {
          common_vendor.index.switchTab({
            url: `/pages/myClass/myClass`
          });
        }, 500);
      } catch (err) {
        common_vendor.index.__f__("log", "at pages/newClass/newClass.vue:336", "表单错误或请求失败", err);
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_number_box2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_number_box = () => "../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_number_box + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.formData.courseName = $event),
    b: common_vendor.p({
      placeholder: "请输入课程名称",
      modelValue: $data.formData.courseName
    }),
    c: common_vendor.p({
      label: "课程名称",
      name: "courseName",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.courseDesc = $event),
    e: common_vendor.p({
      type: "textarea",
      placeholder: "请输入课程介绍",
      modelValue: $data.formData.courseDesc
    }),
    f: common_vendor.p({
      label: "课程介绍",
      name: "courseDesc",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.location = $event),
    h: common_vendor.p({
      placeholder: "请输入课程地点",
      modelValue: $data.formData.location
    }),
    i: common_vendor.p({
      label: "课程地点",
      name: "location",
      required: true
    }),
    j: common_vendor.o(($event) => $data.formData.detailLocation = $event),
    k: common_vendor.p({
      placeholder: "请输入课程详细地点",
      modelValue: $data.formData.detailLocation
    }),
    l: common_vendor.p({
      label: "详细地点",
      name: "location",
      required: true
    }),
    m: $data.formData.coverImage
  }, $data.formData.coverImage ? {
    n: $data.formData.coverImage
  } : {
    o: common_vendor.t($data.formData.coverImage ? "更换图片" : "上传图片"),
    p: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  }, {
    q: common_vendor.p({
      label: "课程背景",
      name: "coverImage",
      required: true
    }),
    r: common_vendor.o(($event) => $data.formData.price = $event),
    s: common_vendor.p({
      type: "number",
      placeholder: "请输入课程价格",
      modelValue: $data.formData.price
    }),
    t: common_vendor.p({
      label: "课程价格",
      name: "price",
      required: true
    }),
    v: common_vendor.o(($event) => $data.formData.courseNote = $event),
    w: common_vendor.p({
      type: "textarea",
      placeholder: "请输入课程说明",
      modelValue: $data.formData.courseNote
    }),
    x: common_vendor.p({
      label: "课程说明",
      name: "courseNote"
    }),
    y: common_vendor.o(($event) => $data.formData.capacity = $event),
    z: common_vendor.p({
      min: 1,
      max: 200,
      modelValue: $data.formData.capacity
    }),
    A: common_vendor.p({
      label: "课程容量",
      name: "capacity",
      required: true
    }),
    B: common_vendor.o(($event) => $data.formData.startDate = $event),
    C: common_vendor.p({
      type: "time",
      ["clear-icon"]: false,
      modelValue: $data.formData.startDate
    }),
    D: common_vendor.p({
      label: "开始日期",
      name: "startDate",
      required: true
    }),
    E: common_vendor.o(($event) => $data.formData.endDate = $event),
    F: common_vendor.p({
      type: "time",
      ["clear-icon"]: false,
      modelValue: $data.formData.endDate
    }),
    G: common_vendor.p({
      label: "结束日期",
      name: "endDate",
      required: true
    }),
    H: common_vendor.f($data.weekDays, (day, index, i0) => {
      return {
        a: common_vendor.t(day),
        b: index,
        c: $data.formData.weekDays.includes(index) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleWeekDay(index), index)
      };
    }),
    I: common_vendor.p({
      label: "上课时间",
      name: "weekDays",
      required: true
    }),
    J: common_vendor.o(($event) => $data.formData.dailyStartTime = $event),
    K: common_vendor.p({
      placeholder: "请输入课程开始时间(用冒号隔开)",
      modelValue: $data.formData.dailyStartTime
    }),
    L: common_vendor.p({
      label: "开始时间",
      name: "dailyStartTime",
      required: true
    }),
    M: common_vendor.o(($event) => $data.formData.dailyEndTime = $event),
    N: common_vendor.p({
      placeholder: "请输入课程结束时间(用冒号隔开)",
      modelValue: $data.formData.dailyEndTime
    }),
    O: common_vendor.p({
      label: "结束时间",
      name: "dailyEndTime",
      required: true
    }),
    P: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    Q: common_vendor.sr("form", "5ba8c310-0"),
    R: common_vendor.p({
      modelValue: $data.formData,
      rules: $data.rules
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/newClass/newClass.js.map
