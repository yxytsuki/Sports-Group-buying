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
      avator: store_user.useUserStore().userInfo.avator,
      amount: "",
      isteacher: false,
      // 是否认证
      iscertified: false
    };
  },
  async onReady() {
    if (store_user.useUserStore().userInfo.token) {
      this.isLogin = true;
      const {
        data
      } = await api_login.getUser(store_user.useUserStore().userInfo.userId);
      common_vendor.index.__f__("log", "at pages/user/index.vue:75", data);
      this.amount = data.amount;
      this.isteacher = data.isteacher;
      this.iscertified = data.iscertified;
      this.nickName = data.nickName;
      this.avator = data.avator;
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
    joinTeacher() {
      if (this.iscertified) {
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
    j: common_vendor.f(7, (item, k0, i0) => {
      return {
        a: item
      };
    }),
    k: common_assets._imports_0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
