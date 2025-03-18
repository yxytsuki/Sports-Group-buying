"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const CardItem = () => "../../components/cartItem/cartItem.js";
const _sfc_main = {
  components: {
    CardItem
  },
  data() {
    return {
      title: "hello",
      tabs: ["社区拼班", "其他拼班动态"],
      positionCurrent: 0,
      items: ["全部", "进行中", "已结束"],
      current: 0,
      banner: [],
      position: "",
      courseList: [],
      filterList: []
    };
  },
  onReady() {
    this.getContentList();
  },
  methods: {
    async onClickItem(e) {
      if (this.current != e.currentIndex) {
        this.current = e.currentIndex;
        const filterData = await api_index.getFilterData(this.current, this.positionCurrent);
        const {
          data
        } = filterData;
        const {
          filterItems
        } = data;
        common_vendor.index.__f__("log", "at pages/index/index.vue:98", data);
        this.filterList = filterItems;
      }
    },
    async handleToggle(e) {
      if (this.positionCurrent != e.currentIndex) {
        this.positionCurrent = e.currentIndex;
        common_vendor.index.__f__("log", "at pages/index/index.vue:105", this.current, this.positionCurrent);
        const filterData = await api_index.getFilterData(this.Current, this.positionCurrent);
        const {
          data
        } = filterData;
        common_vendor.index.__f__("log", "at pages/index/index.vue:110", filterData);
        const {
          filterItems
        } = data;
        this.filterList = filterItems;
        common_vendor.index.__f__("log", "at pages/index/index.vue:115", this.filterList);
      }
    },
    async getContentList() {
      var _a;
      try {
        const res = await api_index.getContentList();
        const filterRes = await api_index.getFilterData(this.current, this.positionCurrent);
        common_vendor.index.__f__("log", "at pages/index/index.vue:122", res);
        common_vendor.index.__f__("log", "at pages/index/index.vue:123", filterRes);
        const {
          data
        } = res;
        common_vendor.index.__f__("log", "at pages/index/index.vue:127", filterRes);
        const {
          bannerList,
          cardItemList
        } = data;
        this.banner = bannerList;
        this.filterList = (_a = filterRes == null ? void 0 : filterRes.data) == null ? void 0 : _a.filterItems;
        this.position = data == null ? void 0 : data.position;
      } catch (err) {
        this.banner = [
          "/static/resource/images/banner/banner1.jpg",
          "/static/resource/images/banner/banner1.jpg",
          "/static/resource/images/banner/banner1.jpg",
          "/static/resource/images/banner/banner1.jpg"
        ];
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_cardItem = common_vendor.resolveComponent("cardItem");
  (_easycom_uni_segmented_control2 + _easycom_uni_icons2 + _component_cardItem)();
}
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_segmented_control + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.banner, (item, index, i0) => {
      return {
        a: item.bannerImage,
        b: item.bannerId
      };
    }),
    b: common_vendor.o($options.handleToggle),
    c: common_vendor.p({
      current: $data.positionCurrent,
      values: $data.tabs,
      ["style-type"]: "text",
      activeColor: "#4cd964"
    }),
    d: common_vendor.p({
      type: "location-filled"
    }),
    e: common_vendor.t($data.position),
    f: common_vendor.o($options.onClickItem),
    g: common_vendor.p({
      current: $data.current,
      values: $data.items,
      styleType: "button",
      activeColor: "#4cd964"
    }),
    h: $data.filterList
  }, $data.filterList ? {
    i: common_vendor.f($data.filterList, (item, index, i0) => {
      return {
        a: "721f2bf6-3-" + i0,
        b: common_vendor.p({
          course: item
        }),
        c: item.cardItemId
      };
    }),
    j: $data.current === 0,
    k: common_vendor.f($data.filterList, (item, index, i0) => {
      return {
        a: "721f2bf6-4-" + i0,
        b: common_vendor.p({
          course: item
        }),
        c: item.cardItemId
      };
    }),
    l: $data.current === 1,
    m: common_vendor.f($data.filterList, (item, index, i0) => {
      return {
        a: "721f2bf6-5-" + i0,
        b: common_vendor.p({
          course: item
        }),
        c: item.cardItemId
      };
    }),
    n: $data.current === 2
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
