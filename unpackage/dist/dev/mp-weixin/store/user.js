"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref(JSON.parse(localStorage.getItem("userInfo")) || {
    avatar: "https://tse2-mm.cn.bing.net/th/id/OIP-C.p6hdmBEvZCMwVcWDVnQr0QAAAA?w=177&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    nickName: "未登录",
    userId: "2025",
    token: ""
  });
  const setUserInfo = (newUserInfo) => {
    userInfo.value = {
      ...userInfo.value,
      ...newUserInfo
    };
  };
  return {
    userInfo,
    setUserInfo
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/user.js.map
