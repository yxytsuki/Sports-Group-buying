"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const api_login = require("../../api/login.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isLogin: false,
      timer: null,
      nickName: store_user.useUserStore().userInfo.nickName,
      avator: store_user.useUserStore().userInfo.avatar,
      amount: "",
      isteacher: false,
      // 是否认证
      iscertified: false
    };
  },
  async onReady() {
    if (store_user.useUserStore().userInfo.token) {
      this.isLogin = true;
      common_vendor.index.__f__("log", "at pages/user/index.vue:90", store_user.useUserStore().userInfo.userId);
      const data = await api_login.getUser(store_user.useUserStore().userInfo.user_id);
      common_vendor.index.__f__("log", "at pages/user/index.vue:92", data);
      const oldUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const newUserInfo = {
        ...oldUserInfo,
        // 保留旧字段
        ...data
        // 覆盖部分字段（只更新传回来的字段）
      };
      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      store_user.useUserStore().setUserInfo(localStorage.getItem("userInfo"));
      this.amount = data.amount;
      this.isteacher = data.is_teacher;
      this.iscertified = data.is_certified;
      this.nickName = data.nickName;
      this.avator = data.avatar;
      common_vendor.index.__f__("log", "at pages/user/index.vue:106", "图片");
      common_vendor.index.__f__("log", "at pages/user/index.vue:107", this.avator);
    }
  },
  onUnload() {
    clearTimeout(this.timer);
  },
  methods: {
    handleLogin() {
      const token = store_user.useUserStore().userInfo.token;
      if (!token) {
        common_vendor.index.showToast({
          title: "跳转中...",
          icon: "loading",
          mask: true,
          duration: 500
        });
        this.timer = setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/getUserInfo/getUserInfo"
          });
        }, 500);
      }
    },
    async logout() {
      const res = await api_login.getlogout();
      common_vendor.index.__f__("log", "at pages/user/index.vue:135", res);
      localStorage.removeItem("userInfo");
      common_vendor.index.navigateTo({
        url: "/pages/getUserInfo/getUserInfo"
      });
    },
    joinTeacher() {
      if (!this.iscertified) {
        common_vendor.index.__f__("log", "at pages/user/index.vue:143", this.iscertified);
        common_vendor.index.showToast({
          title: "跳转中...",
          icon: "loading",
          mask: true,
          duration: 500
        });
        this.timer = setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/certified/certified"
          });
        }, 500);
      } else {
        common_vendor.index.showToast({
          title: "已认证",
          icon: "none",
          mask: true,
          duration: 500
        });
      }
    },
    toggleRole() {
      this.isteacher = !this.isteacher;
      const pageTeacher = [
        {
          page: "/pages/teacherIndex/teacherIndex",
          name: "首页",
          iconpath: "/static/icon/tabBar/home1.png",
          selectedIconPath: "/static/icon/tabBar/home.png"
        },
        {
          page: "/pages/group/index",
          name: "一键开团",
          iconpath: "/static/icon/tabBar/add1.png",
          selectedIconPath: "/static/icon/tabBar/add.png"
        },
        {
          page: "/pages/myClass/myClass",
          name: "我的拼班",
          iconpath: "/static/icon/tabBar/student1.png",
          selectedIconPath: "/static/icon/tabBar/student.png"
        },
        {
          page: "/pages/user/index",
          name: "我的",
          iconpath: "/static/icon/tabBar/honor1.png",
          selectedIconPath: "/static/icon/tabBar/honor.png"
        }
      ];
      const pageStudent = [
        {
          page: "/pages/index/index",
          name: "首页",
          iconpath: "/static/resource/images/home1.png",
          selectedIconPath: "/static/resource/images/home2.png"
        },
        {
          page: "/pages/group/index",
          name: "一键开团",
          iconpath: "/static/resource/images/group1.png",
          selectedIconPath: "/static/resource/images/group2.png"
        },
        {
          page: "/pages/order/index",
          name: "我的订单",
          iconpath: "/static/resource/images/order1.png",
          selectedIconPath: "/static/resource/images/order2.png"
        },
        {
          page: "/pages/user/index",
          name: "我的",
          iconpath: "/static/resource/images/user1.png",
          selectedIconPath: "/static/resource/images/user2.png"
        }
      ];
      if (this.isteacher) {
        pageTeacher.forEach((item, index) => {
          common_vendor.index.setTabBarItem({
            index,
            pagePath: item.page,
            text: item.name,
            iconPath: item.iconpath,
            selectedIconPath: item.selectedIconPath
          });
        });
      } else {
        pageStudent.forEach((item, index) => {
          common_vendor.index.setTabBarItem({
            index,
            pagePath: item.page,
            text: item.name,
            iconPath: item.iconpath,
            selectedIconPath: item.selectedIconPath
          });
        });
      }
    },
    jumpCollected() {
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/collected/collected"
        });
      }, 500);
    },
    jumpModify() {
      this.timer = setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/modify/modify"
        });
      }, 500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.avator,
    b: common_vendor.t($data.isLogin ? $data.nickName : "立即登录"),
    c: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    d: $data.isLogin
  }, $data.isLogin ? {
    e: common_vendor.t($data.isteacher ? "教练版" : "学员版"),
    f: common_vendor.o((...args) => $options.toggleRole && $options.toggleRole(...args))
  } : {}, {
    g: $data.isLogin
  }, $data.isLogin ? {
    h: common_vendor.t($data.amount)
  } : {}, {
    i: common_vendor.o((...args) => $options.joinTeacher && $options.joinTeacher(...args)),
    j: common_assets._imports_0$1,
    k: common_vendor.o((...args) => $options.jumpCollected && $options.jumpCollected(...args)),
    l: common_assets._imports_1,
    m: common_vendor.o((...args) => $options.jumpModify && $options.jumpModify(...args)),
    n: common_assets._imports_2,
    o: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
