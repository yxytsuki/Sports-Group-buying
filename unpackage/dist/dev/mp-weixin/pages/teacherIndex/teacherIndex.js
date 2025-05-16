"use strict";
const common_vendor = require("../../common/vendor.js");
const api_teacher_index = require("../../api/teacher_index.js");
const store_user = require("../../store/user.js");
const js_sdk_amap_amapWx_130 = require("../../js_sdk/amap/amap-wx.130.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isVisible: false,
      amount: store_user.useUserStore().userInfo.amount,
      todayIncome: "",
      todayOrder: 0,
      totalIncome: "",
      nickName: store_user.useUserStore().userInfo.nickName,
      avator: store_user.useUserStore().userInfo.avatar,
      timer: null
    };
  },
  onReady() {
    this.getTeacher();
    this.getLocation();
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  methods: {
    handleVisible() {
      this.$data.isVisible = !this.$data.isVisible;
    },
    // 获取地理位置
    getLocation() {
      const dom = new js_sdk_amap_amapWx_130.amap.AMapWX({
        key: "ae02e28d3e8ca8fd8cdec393417969a9"
      });
      dom.getRegeo({
        sucess: (res) => {
          common_vendor.index.__f__("log", "at pages/teacherIndex/teacherIndex.vue:160", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/teacherIndex/teacherIndex.vue:163", err);
          common_vendor.index.showToast({
            title: "获取地理位置失败",
            icon: "none"
          });
        }
      });
    },
    // 查询教师版首页信息
    async getTeacher() {
      const data = await api_teacher_index.getTeacherIncome({
        teacher_id: store_user.useUserStore().userInfo.user_id
      });
      common_vendor.index.__f__("log", "at pages/teacherIndex/teacherIndex.vue:176", "教师收入信息", data);
      this.amount = data == null ? void 0 : data.balance;
      this.todayIncome = data == null ? void 0 : data.today_income;
      this.todayOrder = data == null ? void 0 : data.today_orders;
      this.totalIncome = data == null ? void 0 : data.total_income;
    },
    jumpTeacherIncome() {
      common_vendor.index.showToast({
        title: "跳转中...",
        icon: "loading",
        mask: true,
        duration: 500
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/teacherIncome/teacherIncome"
        });
      }, 500);
    },
    handleStudentSet() {
      common_vendor.index.showToast({
        title: "跳转中...",
        icon: "loading",
        mask: true,
        duration: 500
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/studentSet/studentSet"
        });
      }, 500);
    },
    handleOrderSet() {
      common_vendor.index.showToast({
        title: "跳转中...",
        icon: "loading",
        mask: true,
        duration: 500
      });
      this.timer = setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/myClass/myClass"
        });
      }, 500);
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "location-filled",
      size: "30"
    }),
    b: common_assets._imports_0$2,
    c: $data.avator,
    d: common_vendor.t($data.nickName),
    e: $data.isVisible
  }, $data.isVisible ? {
    f: common_vendor.o((...args) => $options.handleVisible && $options.handleVisible(...args))
  } : {}, {
    g: !$data.isVisible
  }, !$data.isVisible ? {
    h: common_vendor.o((...args) => $options.handleVisible && $options.handleVisible(...args))
  } : {}, {
    i: $data.isVisible
  }, $data.isVisible ? {
    j: common_vendor.t($data.amount)
  } : {}, {
    k: !$data.isVisible
  }, !$data.isVisible ? {} : {}, {
    l: common_vendor.t(`${$data.todayIncome}元`),
    m: common_vendor.t(`${$data.todayOrder}笔`),
    n: common_vendor.p({
      type: "wallet-filled",
      size: "30"
    }),
    o: common_vendor.t(`${$data.totalIncome}元`),
    p: common_vendor.p({
      type: "wallet-filled",
      size: "30"
    }),
    q: common_vendor.t(`${$data.amount}元`),
    r: common_vendor.o((...args) => $options.jumpTeacherIncome && $options.jumpTeacherIncome(...args)),
    s: common_vendor.o((...args) => $options.handleStudentSet && $options.handleStudentSet(...args)),
    t: common_vendor.o((...args) => $options.handleOrderSet && $options.handleOrderSet(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/teacherIndex/teacherIndex.js.map
