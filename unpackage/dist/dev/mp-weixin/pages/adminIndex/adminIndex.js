"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      menuList: [
        {
          label: "学员管理",
          path: "/pages/adminStudent/adminStudent",
          icon: "/static/icon/admin/student.png"
        },
        {
          label: "教练管理",
          path: "/pages/adminTeacher/adminTeacher",
          icon: "/static/icon/admin/teacher1.png"
        },
        {
          label: "订单管理",
          path: "/pages/admin/orders",
          icon: "/static/icon/admin/order.png"
        },
        {
          label: "课程管理",
          path: "/pages/admin/courses",
          icon: "/static/icon/admin/course.png"
        }
      ]
    };
  },
  methods: {
    goToPage(path) {
      common_vendor.index.navigateTo({
        url: path
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.menuList, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.label),
        c: index,
        d: common_vendor.o(($event) => $options.goToPage(item.path), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-129b7eab"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/adminIndex/adminIndex.js.map
