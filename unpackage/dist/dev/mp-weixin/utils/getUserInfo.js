"use strict";
const common_vendor = require("../common/vendor.js");
const store_user = require("../store/user.js");
function useAuth() {
  const userStore = store_user.useUserStore();
  const isLogin = () => {
    var _a;
    const token = (_a = userStore.userInfo) == null ? void 0 : _a.token;
    if (!token) {
      common_vendor.index.showToast({
        title: "请先登录",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/getUserInfo/getUserInfo"
        });
      }, 800);
      return false;
    }
    return true;
  };
  return {
    isLogin
  };
}
exports.useAuth = useAuth;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/getUserInfo.js.map
