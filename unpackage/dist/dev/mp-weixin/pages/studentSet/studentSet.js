"use strict";
const common_vendor = require("../../common/vendor.js");
const api_student = require("../../api/student.js");
const store_user = require("../../store/user.js");
const _sfc_main = {
  data() {
    return {
      teacherId: store_user.useUserStore().userInfo.user_id,
      searchKeyword: "",
      studentList: [],
      currentStudent: {}
    };
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  async created() {
    this.debouncedInput = common_vendor.lodashExports.debounce(this.handleInput, 500);
    const res = await api_student.getStudentList({
      teacher_id: this.teacherId
    });
    common_vendor.index.__f__("log", "at pages/studentSet/studentSet.vue:88", res);
    this.studentList = [...res];
  },
  methods: {
    async showStudentDetail(id) {
      common_vendor.index.__f__("log", "at pages/studentSet/studentSet.vue:93", id);
      const res = await api_student.teacherStudentDetail({
        enrollment_id: id
      });
      common_vendor.index.__f__("log", "at pages/studentSet/studentSet.vue:98", res);
      this.currentStudent = {
        enrollment_id: id,
        ...res
      };
      common_vendor.index.__f__("log", "at pages/studentSet/studentSet.vue:103", this.currentStudent);
      this.$refs.detailPopup.open();
    },
    closePopup() {
      this.$refs.detailPopup.close();
    },
    async handleDelete(id) {
      common_vendor.index.__f__("log", "at pages/studentSet/studentSet.vue:110", id);
      const res = await api_student.teacherStudent({
        enrollment_id: id
      });
      common_vendor.index.__f__("log", "at pages/studentSet/studentSet.vue:115", res);
      this.doSearch();
    },
    // 输入框实时防抖处理
    handleInput(e) {
      this.searchKeyword = e;
    },
    // 处理键盘事件
    handleKeyPress(e) {
      if (e.keyCode === 13 || e.key === "Enter") {
        this.doSearch();
      }
    },
    // 搜索方法
    doSearch() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        const res = await api_student.getStudentList({
          teacher_id: this.teacherId,
          keyword: this.searchKeyword
        });
        this.studentList = [...res];
      }, 500);
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.handleInput),
    b: common_vendor.o($options.handleKeyPress),
    c: common_vendor.p({
      placeholder: "搜索学员",
      bgColor: "#EEEEEE"
    }),
    d: common_vendor.f($data.studentList, (student, index, i0) => {
      return {
        a: student.avatar,
        b: common_vendor.t(student.nickName),
        c: common_vendor.t(student.title),
        d: "13a6b970-1-" + i0,
        e: common_vendor.o(($event) => $options.handleDelete(student.enrollment_id), student.id),
        f: student.id,
        g: common_vendor.o(($event) => $options.showStudentDetail(student.enrollment_id), student.id)
      };
    }),
    e: common_vendor.p({
      type: "trash",
      size: "20",
      color: "#ff0000"
    }),
    f: $data.currentStudent
  }, $data.currentStudent ? {
    g: common_vendor.p({
      type: "close",
      size: "20"
    }),
    h: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    i: $data.currentStudent.avatar,
    j: common_vendor.t($data.currentStudent.nickName),
    k: common_vendor.t($data.currentStudent.student_id),
    l: common_vendor.t($data.currentStudent.enrollment_time),
    m: common_vendor.t($data.currentStudent.phone)
  } : {}, {
    n: common_vendor.sr("detailPopup", "13a6b970-2"),
    o: common_vendor.p({
      type: "center"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/studentSet/studentSet.js.map
