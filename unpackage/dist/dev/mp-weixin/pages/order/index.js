"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const store_user = require("../../store/user.js");
const utils_getUserInfo = require("../../utils/getUserInfo.js");
const orderListItem = () => "../../components/orderListItem/orderListItem.js";
const _sfc_main = {
  components: {
    orderListItem
  },
  onReady() {
    this.getOrderContent();
    const {
      isLogin
    } = utils_getUserInfo.useAuth();
    if (!isLogin()) {
      common_vendor.index.__f__("log", "at pages/order/index.vue:38", "未登录，已跳转");
    } else {
      common_vendor.index.__f__("log", "at pages/order/index.vue:40", "已登录，继续执行业务逻辑");
    }
  },
  data() {
    return {
      filterTabs: ["全部", "待支付", "拼班中", "已完成"],
      current: 0,
      orderList: [],
      isFinited: false,
      user_id: store_user.useUserStore().userInfo.user_id
    };
  },
  methods: {
    async getOrderContent() {
      const data = await api_order.getFilterOrder({
        userId: this.user_id
      });
      common_vendor.index.__f__("log", "at pages/order/index.vue:57", data);
      this.orderList = data.list;
      common_vendor.index.__f__("log", "at pages/order/index.vue:59", this.orderList);
    },
    async onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
        common_vendor.index.__f__("log", "at pages/order/index.vue:64", this.current);
        const filterData = await api_order.getFilterOrder({
          userId: this.user_id,
          current: this.current
        });
        common_vendor.index.__f__("log", "at pages/order/index.vue:70", filterData);
        this.orderList = [...filterData == null ? void 0 : filterData.list];
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_orderListItem2 = common_vendor.resolveComponent("orderListItem");
  (_easycom_uni_segmented_control2 + _easycom_orderListItem2)();
}
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_orderListItem = () => "../../components/orderListItem/orderListItem.js";
if (!Math) {
  (_easycom_uni_segmented_control + _easycom_orderListItem)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onClickItem),
    b: common_vendor.p({
      current: $data.current,
      values: $data.filterTabs,
      ["style-type"]: "text",
      activeColor: "#4cd964"
    }),
    c: common_vendor.f($data.orderList, (item, index, i0) => {
      return {
        a: "d142c11c-1-" + i0,
        b: common_vendor.p({
          orderItem: item
        }),
        c: item.order_id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/index.js.map
