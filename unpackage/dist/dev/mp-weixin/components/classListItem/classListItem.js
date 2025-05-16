"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "classListItem",
  props: {
    classListItem: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var _a, _b, _c;
    return {
      overlap: 20,
      students: (_a = this.classListItem) == null ? void 0 : _a.students,
      startTime: (_b = this.classListItem) == null ? void 0 : _b.start_time,
      endTime: (_c = this.classListItem) == null ? void 0 : _c.end_time,
      now: Date.now()
    };
  },
  methods: {
    // 将毫秒时间戳转化为日期格式
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const Y = date.getFullYear();
      const M = String(date.getMonth() + 1).padStart(2, "0");
      const D = String(date.getDate()).padStart(2, "0");
      String(date.getHours()).padStart(2, "0");
      String(date.getMinutes()).padStart(2, "0");
      String(date.getSeconds()).padStart(2, "0");
      return `${Y}-${M}-${D}`;
    },
    getWeekNumber(startTime, endTime, now) {
      const weekMillis = 7 * 24 * 60 * 60 * 1e3;
      if (now < startTime || now > endTime) {
        return this.getWeeks;
      }
      const diff = now - startTime;
      const weekIndex = Math.floor(diff / weekMillis) + 1;
      return weekIndex;
    }
  },
  computed: {
    subNumber() {
      var _a;
      return ((_a = this.classListItem) == null ? void 0 : _a.total_number) - this.students.length;
    },
    getWeeks() {
      const diffTime = Math.abs(this.endTime - this.startTime);
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      const weeks = Math.ceil(diffDays / 7);
      return weeks;
    }
  },
  onLoad() {
    common_vendor.index.__f__("log", "at components/classListItem/classListItem.vue:102", "学生", this.classListItem);
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
  var _a, _b, _c;
  return common_vendor.e({
    a: common_vendor.t((_a = $props.classListItem) == null ? void 0 : _a.title),
    b: common_vendor.t(`总周期${$options.getWeeks}周 当前第${$options.getWeekNumber($data.startTime, $data.endTime, $data.now)}周`),
    c: $data.students.length <= 3
  }, $data.students.length <= 3 ? {
    d: common_vendor.f($data.students, (item, index, i0) => {
      return {
        a: item == null ? void 0 : item.avatar,
        b: index,
        c: `${25 + index * $data.overlap}px`
      };
    })
  } : {}, {
    e: common_vendor.t(`剩余个名额${$options.subNumber}`),
    f: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    g: common_vendor.t((_b = $props.classListItem) == null ? void 0 : _b.class_number),
    h: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    i: common_vendor.t((_c = $props.classListItem) == null ? void 0 : _c.address),
    j: common_vendor.p({
      type: "map-pin-ellipse"
    }),
    k: common_vendor.t($options.formatTimestamp($data.startTime)),
    l: common_vendor.t($options.formatTimestamp($data.endTime))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/classListItem/classListItem.js.map
