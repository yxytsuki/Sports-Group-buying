"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const api_collected = require("../../api/collected.js");
const CardItem = () => "../../components/collectedItem/collectedItem.js";
const _sfc_main = {
  components: {
    CardItem
  },
  data() {
    return {
      courseList: [],
      user_id: store_user.useUserStore().userInfo.user_id
    };
  },
  created() {
    this.debouncedInput = common_vendor.lodashExports.debounce(this.handleInput, 500);
  },
  async onLoad() {
    const res = await api_collected.getCollectedCourse({
      userId: this.user_id
    });
    common_vendor.index.__f__("log", "at pages/collected/collected.vue:40", res);
    this.courseList = res;
  },
  methods: {
    // 输入框实时防抖处理
    handleInput(e) {
      this.searchKeyword = e;
    },
    // 处理键盘事件
    handleKeyPress(e) {
      if (e.keyCode === 13 || e.key === "Enter") {
        this.doSearch(e);
      }
    },
    // 实际搜索方法
    async doSearch() {
      const res = await api_collected.getCollectedCourse({
        userId: this.user_id,
        keyword: this.searchKeyword
      });
      common_vendor.index.__f__("log", "at pages/collected/collected.vue:61", res);
      this.courseList = [...res];
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _component_CardItem = common_vendor.resolveComponent("CardItem");
  (_easycom_uni_search_bar2 + _component_CardItem)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
if (!Math) {
  _easycom_uni_search_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.handleInput),
    b: common_vendor.o($options.handleKeyPress),
    c: common_vendor.p({
      placeholder: "搜索课程",
      bgColor: "#EEEEEE"
    }),
    d: common_vendor.f($data.courseList, (item, index, i0) => {
      return {
        a: "80b122b8-1-" + i0,
        b: common_vendor.p({
          course: item
        })
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collected/collected.js.map
