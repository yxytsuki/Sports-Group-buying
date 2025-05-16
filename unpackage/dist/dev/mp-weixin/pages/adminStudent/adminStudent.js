"use strict";
const common_vendor = require("../../common/vendor.js");
const api_admin = require("../../api/admin.js");
const _sfc_main = {
  data() {
    return {
      searchKeyword: "",
      studentList: [{
        id: "1",
        avator: "https://img1.baidu.com/it/u=3082600848,2377791971&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
        nickName: "错雅鑫",
        phone: "13867675656",
        studentId: "1001",
        enrollDate: "2023-01-15"
      }]
    };
  },
  async created() {
    this.debouncedInput = common_vendor.lodashExports.debounce(this.handleInput, 500);
    const res = await api_admin.adminGetStudent();
    common_vendor.index.__f__("log", "at pages/adminStudent/adminStudent.vue:66", res);
    this.studentList = [...res];
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  methods: {
    showStudentDetail(studentId) {
    },
    modify(id) {
      common_vendor.index.__f__("log", "at pages/adminStudent/adminStudent.vue:78", id);
      common_vendor.index.showToast({
        icon: "loading",
        title: "加载中"
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: `/pages/newStudent/newStudent?mode=modify&user_id=${id}`
        });
      }, 500);
    },
    look(id) {
      common_vendor.index.__f__("log", "at pages/adminStudent/adminStudent.vue:91", id);
      common_vendor.index.showToast({
        icon: "loading",
        title: "加载中"
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: `/pages/newStudent/newStudent?mode=look&user_id=${id}`
        });
      }, 500);
    },
    async handleDelete(id) {
      common_vendor.index.__f__("log", "at pages/adminStudent/adminStudent.vue:104", id);
      await api_admin.admindelStudent({
        user_id: id
      });
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
    // 实际搜索方法
    async doSearch() {
      const res = await api_admin.adminGetStudent({
        keyword: this.searchKeyword
      });
      common_vendor.index.showLoading({
        title: "搜索中..."
      });
      this.timer = setTimeout(() => {
        common_vendor.index.hideLoading();
        this.studentList = [...res];
      }, 500);
      common_vendor.index.__f__("log", "at pages/adminStudent/adminStudent.vue:134", this.searchKeyword);
    },
    addStudent() {
      common_vendor.index.showToast({
        icon: "loading",
        title: "加载中"
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: `/pages/newStudent/newStudent?mode=add`
        });
      }, 500);
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.handleInput),
    b: common_vendor.o($options.handleKeyPress),
    c: common_vendor.p({
      placeholder: "搜索学员",
      bgColor: "#EEEEEE"
    }),
    d: common_vendor.f($data.studentList, (student, index, i0) => {
      return {
        a: student.avatar,
        b: common_vendor.t(student.user_id),
        c: common_vendor.t(student.user_name),
        d: common_vendor.o(($event) => $options.modify(student.user_id), student.user_id),
        e: common_vendor.o(($event) => $options.look(student.user_id), student.user_id),
        f: "1c51cb10-1-" + i0,
        g: common_vendor.o(($event) => $options.handleDelete(student.user_id), student.user_id),
        h: student.user_id
      };
    }),
    e: common_vendor.p({
      type: "trash",
      size: "20",
      color: "#ff0000"
    }),
    f: common_vendor.o((...args) => $options.addStudent && $options.addStudent(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/adminStudent/adminStudent.js.map
