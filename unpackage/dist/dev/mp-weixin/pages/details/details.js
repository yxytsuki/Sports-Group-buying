"use strict";
const common_vendor = require("../../common/vendor.js");
const api_details = require("../../api/details.js");
const store_user = require("../../store/user.js");
const utils_getUserInfo = require("../../utils/getUserInfo.js");
const _sfc_main = {
  onLoad(options) {
    this.getContentList(options.id);
    this.courseId = options.id;
    const {
      isLogin
    } = utils_getUserInfo.useAuth();
    if (!isLogin()) {
      common_vendor.index.__f__("log", "at pages/details/details.vue:160", "未登录，已跳转");
    } else {
      common_vendor.index.__f__("log", "at pages/details/details.vue:162", "已登录，继续执行业务逻辑");
    }
  },
  data() {
    return {
      courseDetail: {},
      studentsNumber: 0,
      startTime: "",
      endTime: "",
      courseId: "",
      weekNumber: 0,
      timer: null,
      user_id: store_user.useUserStore().userInfo.user_id
    };
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  computed: {
    // 计算属性的getter
    getWeeks() {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      const weeks = Math.ceil(diffDays / 7);
      return weeks;
    }
  },
  methods: {
    async getContentList(courseId) {
      var _a, _b, _c;
      const data = await api_details.getCourseDetail({
        courseId,
        userId: this.user_id
      });
      this.courseDetail = data;
      common_vendor.index.__f__("log", "at pages/details/details.vue:200", this.courseDetail);
      this.studentsNumber = data == null ? void 0 : data.students.length;
      this.startTime = (_a = data == null ? void 0 : data.time) == null ? void 0 : _a.startTime;
      this.endTime = (_b = data == null ? void 0 : data.time) == null ? void 0 : _b.endTime;
      this.weekNumber = (_c = data == null ? void 0 : data.time) == null ? void 0 : _c.day.length;
    },
    async handleCollected() {
      const res = await api_details.collected({
        userId: this.user_id,
        courseId: this.courseId
      });
      common_vendor.index.__f__("log", "at pages/details/details.vue:215", res);
      if (res == null ? void 0 : res.isCollected) {
        common_vendor.index.showToast({
          title: "收藏成功",
          icon: "success",
          mask: true,
          duration: 500
        });
      } else {
        common_vendor.index.showToast({
          title: "收藏失败",
          icon: "error",
          mask: true,
          duration: 500
        });
      }
      this.courseDetail.iscollected = res == null ? void 0 : res.isCollected;
    },
    handleJump() {
    },
    goPay(id) {
      common_vendor.index.showToast({
        title: "跳转中...",
        icon: "loading",
        mask: true,
        duration: 500
      });
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: `/pages/pay/pay?courseId=${id}`
        });
      }, 500);
    },
    handleShare() {
      this.shareToggle();
    },
    shareToggle() {
      this.$refs.share.open();
    }
  }
};
if (!Array) {
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup_share2 = common_vendor.resolveComponent("uni-popup-share");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_grid_item2 + _easycom_uni_grid2 + _easycom_uni_icons2 + _easycom_uni_popup_share2 + _easycom_uni_popup2)();
}
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup_share = () => "../../uni_modules/uni-popup/components/uni-popup-share/uni-popup-share.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_grid_item + _easycom_uni_grid + _easycom_uni_icons + _easycom_uni_popup_share + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.courseDetail.backgroundImage,
    b: common_vendor.t($data.courseDetail.title),
    c: common_vendor.t(`上课老师：${$data.courseDetail.teacherName}`),
    d: common_vendor.f(2, (week, k0, i0) => {
      return {
        a: common_vendor.f(4, (item, k1, i1) => {
          return {
            a: common_vendor.t(`第${item}周`),
            b: item,
            c: "2c0884d4-1-" + i0 + "-" + i1 + "," + ("2c0884d4-0-" + i0),
            d: common_vendor.p({
              index: item
            })
          };
        }),
        b: "2c0884d4-0-" + i0,
        c: week
      };
    }),
    e: common_vendor.p({
      column: 4,
      highlight: true
    }),
    f: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    g: common_vendor.t(`上课时间： 10:00~12:00`),
    h: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    i: common_vendor.t(`上课社区： ${$data.courseDetail.address}`),
    j: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    k: common_vendor.t(`上课地点： ${$data.courseDetail.adressDetail}`),
    l: common_vendor.o($options.handleJump),
    m: common_vendor.p({
      type: "paperplane",
      size: "36"
    }),
    n: common_vendor.t(`￥${$data.courseDetail.coursePrice}/节`),
    o: common_vendor.t(`${$data.courseDetail.totalNumber}人班`),
    p: common_vendor.t(`满${$data.courseDetail.totalNumber}人成班，剩余`),
    q: common_vendor.t($data.courseDetail.totalNumber - $data.studentsNumber),
    r: common_vendor.f($data.courseDetail.students, (item, index, i0) => {
      return {
        a: item.avator,
        b: item.studentId
      };
    }),
    s: $data.courseDetail.courseDesc,
    t: $data.courseDetail.courseMsg,
    v: common_vendor.o($options.handleShare),
    w: common_vendor.p({
      type: "undo",
      size: "30"
    }),
    x: !$data.courseDetail.iscollected
  }, !$data.courseDetail.iscollected ? {
    y: common_vendor.o($options.handleCollected),
    z: common_vendor.p({
      type: "star",
      size: "30"
    })
  } : {
    A: common_vendor.o($options.handleCollected),
    B: common_vendor.p({
      type: "star-filled",
      size: "30",
      color: "#ff7357"
    })
  }, {
    C: common_vendor.o(($event) => $options.goPay($data.courseId)),
    D: common_vendor.sr("share", "2c0884d4-9"),
    E: common_vendor.p({
      type: "share",
      safeArea: true,
      backgroundColor: "#fff"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/details/details.js.map
