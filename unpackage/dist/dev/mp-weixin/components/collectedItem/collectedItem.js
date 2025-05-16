"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/user.js");
const _sfc_main = {
  props: {
    course: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  name: "collectedItem",
  onLoad() {
    common_vendor.index.__f__("log", "at components/collectedItem/collectedItem.vue:43", 11);
    common_vendor.index.__f__("log", "at components/collectedItem/collectedItem.vue:44", course);
  },
  onUnload() {
    clearTimeout(timer);
  },
  data() {
    return {};
  },
  methods: {
    cleanCourseMsg(msg) {
      return (msg == null ? void 0 : msg.replace(/<br\s*\/?>/gi, " ")) || "";
    },
    jumpCourseDetail(id) {
      common_vendor.index.__f__("log", "at components/collectedItem/collectedItem.vue:60", id);
      if (this.course.is_running) {
        common_vendor.index.showToast({
          title: "跳转中...",
          icon: "loading",
          mask: true,
          duration: 500
        });
        this.timer = setTimeout(() => {
          common_vendor.index.navigateTo({
            url: `/pages/details/details?id=${id}`
          });
        }, 500);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.course.background_image,
    b: common_vendor.t(`${$props.course.distance}km`),
    c: common_vendor.t($props.course.title),
    d: common_vendor.t($options.cleanCourseMsg($props.course.course_msg)),
    e: common_vendor.t($props.course.is_running ? "进行中" : "已结束"),
    f: common_vendor.n($props.course.is_running ? "collected-status" : "collected-unstatus"),
    g: common_vendor.o(($event) => $options.jumpCourseDetail($props.course.course_id))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/collectedItem/collectedItem.js.map
