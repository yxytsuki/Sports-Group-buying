"use strict";
const common_vendor = require("../../common/vendor.js");
const api_teacher = require("../../api/teacher.js");
const store_user = require("../../store/user.js");
common_vendor.use([
  common_vendor.install,
  common_vendor.install$1,
  common_vendor.install$2,
  common_vendor.install$3,
  common_vendor.install$4,
  common_vendor.install$5,
  common_vendor.install$6,
  common_vendor.install$7,
  common_vendor.installLabelLayout,
  common_vendor.installUniversalTransition,
  common_vendor.install$8
]);
let chart = null;
const _sfc_main = {
  data() {
    return {
      viewMode: "week",
      // 模拟数据
      weekData: {
        xAxis: ["第一周", "第二周", "第三周", "第四周"],
        actualData: [12800, 15600, 18900, 22e3]
      },
      dayData: {
        xAxis: Array.from({
          length: 30
        }, (_, i) => `${i + 1}日`),
        actualData: Array.from({
          length: 30
        }, () => Math.floor(Math.random() * 3e3) + 2e3)
      }
    };
  },
  async created() {
    const res = await api_teacher.getTeacherIncome({
      teacher_id: store_user.useUserStore().userInfo.user_id
    });
    common_vendor.index.__f__("log", "at pages/teacherIncome/teacherIncome.vue:143", "初始化", res);
    this.weekData.actualData = [...res == null ? void 0 : res.weeklyIncome];
    this.dayData.actualData = [...res == null ? void 0 : res.dailyIncome];
    this.updateChart();
  },
  mounted() {
    this.initChart();
  },
  // 处理屏幕旋转或尺寸变化
  onResize() {
    if (chart) {
      chart.resize();
    }
  },
  // 组件销毁时释放图标实例
  beforeDestroy() {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  },
  computed: {
    totalAmount() {
      const currentData = this.viewMode.value === "week" ? this.weekData : this.dayData;
      return currentData.actualData.reduce((a, b) => a + b, 0);
    },
    // 统计表格数据
    summaryData() {
      if (this.viewMode === "week") {
        return this.weekData.xAxis.map((period, index) => {
          const actual = this.weekData.actualData[index];
          const prev = this.weekData.actualData[index - 1];
          let growth = 0;
          if (index !== 0 && prev && prev !== 0) {
            growth = Math.round((actual - prev) / prev * 100);
          }
          return {
            period,
            actual,
            growth
          };
        });
      } else {
        const groups = [];
        for (let i = 0; i < 30; i += 6) {
          const acturalSum = this.dayData.actualData.slice(i, i + 6).reduce((a, b) => a + b, 0);
          const prevSum = i === 0 ? null : groups[groups.length - 1].actual;
          let growth = 0;
          if (prevSum && prevSum !== 0) {
            growth = Math.round((acturalSum - prevSum) / prevSum * 100);
          }
          groups.push({
            period: `${i + 1}-${Math.min(i + 6, 30)}日`,
            actual: acturalSum,
            growth: i === 0 ? 0 : growth
          });
        }
        return groups;
      }
    }
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async initChart() {
      try {
        const query = common_vendor.index.createSelectorQuery().in(this);
        const canvasNode = await new Promise((resolve) => {
          query.select("#income-chart").fields({
            node: true,
            size: true
          }).exec((res) => {
            resolve(res[0]);
          });
        });
        const canvas = canvasNode.node;
        const ctx = canvas.getContext("2d");
        const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
        const screenWidth = common_vendor.index.getSystemInfoSync().screenWidth;
        const canvasHeight = screenWidth * 0.3;
        const canvasWidth = screenWidth * 0.26;
        canvas.width = canvasNode.width * dpr;
        canvas.height = canvasNode.height * dpr;
        ctx.scale(dpr, dpr);
        chart = common_vendor.init(canvas, null, {
          width: canvasWidth,
          height: canvasHeight,
          devicePixelRatio: dpr
        });
        chart.setOption({
          ...this.getChartOption()
        });
        this.updateChart();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/teacherIncome/teacherIncome.vue:248", "图标初始化失败", error);
      }
    },
    getChartOption() {
      const currentData = this.viewMode === "week" ? this.weekData : this.dayData;
      return {
        backgroundColor: "#fff",
        grid: {
          top: "1%",
          left: 0,
          right: "-5%",
          bottom: "-3%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            return `${params[0].name}
收入：￥${params[0].value}`;
          }
        },
        xAxis: {
          type: "category",
          data: currentData.xAxis,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#eee"
            }
          },
          axisLabel: {
            interval: this.viewMode === "day" ? 2 : 0,
            color: "#666",
            fontSize: 4
          }
        },
        yAxis: {
          type: "value",
          name: "收入（元）",
          nameTextStyle: {
            color: "#666",
            fontSize: 4,
            padding: [0, 0, 0, 4]
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#f5f5f5",
              type: "dashed"
            }
          },
          axisLabel: {
            color: "#666",
            fontSize: 4
          }
        },
        series: [{
          type: "line",
          data: currentData.actualData,
          symbolSize: 3,
          symbol: "circle",
          smooth: true,
          itemStyle: {
            color: "#6236ff"
          },
          lineStyle: {
            color: "#6236ff",
            width: 1
          },
          areaStyle: {
            color: new common_vendor.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "rgba(98,54,255,0.3)"
            }, {
              offset: 1,
              color: "rgba(98,54,255,0.05)"
            }])
          }
        }]
      };
    },
    updateChart() {
      if (chart) {
        chart.setOption(this.getChartOption());
      }
    },
    toggleView(mode) {
      this.viewMode = mode;
      this.updateChart();
    },
    // 处理触摸事件
    touchStart(e) {
      if (chart && e.touches.length > 0) {
        const touch = e.touches[0];
        const handler = chart.getZr().handler;
        handler.dispatch("mousedown", {
          zrX: touch.x,
          zrY: touch.y
        });
      }
    },
    touchMove(e) {
      var _a;
      if (chart && e.touches.length > 0) {
        const touch = e.touches[0];
        const handler = (_a = chart == null ? void 0 : chart.getZr()) == null ? void 0 : _a.handler;
        handler.dispatch("mousemove", {
          zrX: touch.x,
          zrY: touch.y
        });
      }
    },
    touchEnd(e) {
      if (chart) {
        const touch = e.changedTouches ? e.changedTouches[0] : {};
        const handler = chart.getZr().handler;
        handler.dispatch("mouseup", {
          zrX: touch.x,
          zrY: touch.y
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n({
      active: $data.viewMode === "week"
    }),
    b: common_vendor.o(($event) => $options.toggleView("week")),
    c: common_vendor.n({
      active: $data.viewMode === "day"
    }),
    d: common_vendor.o(($event) => $options.toggleView("day")),
    e: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    f: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    g: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args)),
    h: common_vendor.f($options.summaryData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.period),
        b: common_vendor.t($options.formatNumber(item.actual)),
        c: common_vendor.t(item.growth >= 0 ? "+" : ""),
        d: common_vendor.t(item.growth),
        e: common_vendor.n(item.growth >= 0 ? "positive" : "negative"),
        f: index
      };
    }),
    i: common_vendor.t($options.formatNumber($options.totalAmount))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/teacherIncome/teacherIncome.js.map
