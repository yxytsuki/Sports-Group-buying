<template>
	<view class="container">
		<view class="header">
			<text class="title">收入明细分析</text>
			<text class="subtitle">实时跟踪收入明细</text>
		</view>
		<!-- 列表区域 -->
		<view class="card chart-card">
			<view class="button-group">
				<view :class="['toggle-btn',{active:viewMode==='week'}]" @click="toggleView('week')">
					周维度
				</view>
				<view :class="['toggle-btn',{active:viewMode==='day'}]" @click="toggleView('day')">
					日维度
				</view>
			</view>
			<view class="chart-container">
				<canvas type="2d" id="income-chart" class="income-chart" @touchstart="touchStart" @touchmove="touchMove"
					@touchend="touchEnd"></canvas>
			</view>

		</view>

		<!-- 统计表格 -->
		<view class="card table-card">
			<text class="table-title">收入统计明细</text>
			<view class="table-container">
				<view class="table-header">
					<view class="th">
						时间段
					</view>
					<view class="th">
						收入金额（元）
					</view>
					<view class="th">
						环比变化
					</view>
				</view>
				<view class="table-row" v-for="(item,index) in summaryData" :key="index">
					<view class="td">
						{{item.period}}
					</view>
					<view class="td">
						￥{{formatNumber(item.actual)}}
					</view>
					<view class="td">
						<view :class="['growth',item.growth>=0?'positive':'negative']">
							{{item.growth>=0?'+':''}}{{item.growth}}%
						</view>
					</view>
				</view>
				<view class="table-footer">
					<view class="td">
						合计
					</view>
					<view class="td">
						￥{{formatNumber(totalAmount)}}
					</view>
					<view class="td">
						-
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
	import * as echarts from 'echarts/core';
	// 引入柱状图图表，图表后缀都为 Chart
	import {
		BarChart
	} from 'echarts/charts';
	// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
	import {
		LineChart
	} from 'echarts/charts';
	import {
		TitleComponent,
		TooltipComponent,
		GridComponent,
		LegendComponent,
		DatasetComponent,
		TransformComponent
	} from 'echarts/components';
	// 标签自动布局、全局过渡动画等特性
	import {
		LabelLayout,
		UniversalTransition
	} from 'echarts/features';
	// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
	import {
		CanvasRenderer
	} from 'echarts/renderers';

	// 注册必须的组件
	echarts.use([
		LineChart,
		TitleComponent,
		TooltipComponent,
		GridComponent,
		DatasetComponent,
		TransformComponent,
		BarChart,
		LegendComponent,
		LabelLayout,
		UniversalTransition,
		CanvasRenderer
	]);
	let chart = null
	export default {
		data() {
			return {
				viewMode: 'week',
				// 模拟数据
				weekData: {
					xAxis: ['第一周', '第二周', '第三周', '第四周'],
					actualData: [12800, 15600, 18900, 22000]
				},
				dayData: {
					xAxis: Array.from({
						length: 30
					}, (_, i) => `${i+1}日`),
					actualData: Array.from({
						length: 30
					}, () => Math.floor(Math.random() * 3000) + 2000)
				}

			}
		},
		mounted() {
			this.initChart()
		},
		// 处理屏幕旋转或尺寸变化
		onResize() {
			if (chart) {
				chart.resize()
			}
		},
		// 组件销毁时释放图标实例
		beforeDestroy() {
			if (chart) {
				chart.dispose()
				chart = null
			}
		},
		computed: {
			totalAmount() {
				const currentData = this.viewMode.value === 'week' ? this.weekData : this.dayData
				return currentData.actualData.reduce((a, b) => a + b, 0)
			},
			// 统计表格数据
			summaryData() {
				if (this.viewMode === 'week') {
					return this.weekData.xAxis.map((period, index) => {
						const actual = this.weekData.actualData[index]
						const growth = index === 0 ? 0 : Math.round(((actual - this.weekData.actualData[index -
							1]) / this.weekData.actualData[index - 1]) * 100)
						return {
							period,
							actual,
							growth
						}
					})
				} else {
					const groups = []
					for (let i = 0; i < 30; i += 6) {
						const acturalSum = this.dayData.actualData.slice(i, i + 6).reduce((a, b) => a + b, 0)
						groups.push({
							period: `${i+1}-${Math.min(i+6,30)}日`,
							actual: acturalSum,
							growth: i === 0 ? 0 : Math.round(((acturalSum - groups[groups.length - 1]
								.actual) / groups[groups.length - 1].actual) * 100)
						})
					}
					return groups
				}
			},

		},
		methods: {
			formatNumber(num) {
				return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			},
			async initChart() {
				try {
					const query = uni.createSelectorQuery().in(this)
					const canvasNode = await new Promise(resolve => {
						query.select('#income-chart')
							.fields({
								node: true,
								size: true
							})
							.exec((res) => {
								resolve(res[0])
							})
					})
					const canvas = canvasNode.node
					const ctx = canvas.getContext('2d')
					// 获取设备像素比
					const dpr = uni.getSystemInfoSync().pixelRatio
					// 获取屏幕宽度
					const screenWidth = uni.getSystemInfoSync().screenWidth
					// 计算实际要用的canvas尺寸
					const canvasHeight = screenWidth * 0.3
					const canvasWidth = screenWidth * 0.26
					// 设置canvas尺寸
					canvas.width = canvasNode.width * dpr
					canvas.height = canvasNode.height * dpr
					ctx.scale(dpr, dpr)
					// 初始化图表
					chart = echarts.init(canvas, null, {
						width: canvasWidth,
						height: canvasHeight,
						devicePixelRatio: dpr
					})
					// 设置默认缩放比例
					const scale = 0.4
					chart.setOption({
						...this.getChartOption()
					})

					this.updateChart()
				} catch (error) {
					console.error('图标初始化失败', error)
				}
			},
			getChartOption() {
				const currentData = this.viewMode === 'week' ? this.weekData : this.dayData
				return {
					backgroundColor: '#fff',
					grid: {
						top: '1%',
						left: 0,
						right: '-5%',
						bottom: '-3%',
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						formatter: function(params) {
							return `${params[0].name}\n收入：￥${params[0].value}`
						}
					},
					xAxis: {
						type: 'category',
						data: currentData.xAxis,
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: '#eee'
							}
						},
						axisLabel: {
							interval: this.viewMode === 'day' ? 2 : 0,
							color: '#666',
							fontSize: 4,
						}
					},
					yAxis: {
						type: 'value',
						name: '收入（元）',
						nameTextStyle: {
							color: '#666',
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
								color: '#f5f5f5',
								type: 'dashed'
							}
						},
						axisLabel: {
							color: '#666',
							fontSize: 4
						}
					},
					series: [{
						type: 'line',
						data: currentData.actualData,
						symbolSize: 3,
						symbol: 'circle',
						smooth: true,
						itemStyle: {
							color: '#6236ff'
						},
						lineStyle: {
							color: '#6236ff',
							width: 1
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(98,54,255,0.3)'
							}, {
								offset: 1,
								color: 'rgba(98,54,255,0.05)'
							}])
						}
					}]
				}
			},
			updateChart() {
				if (chart) {
					chart.setOption(this.getChartOption())
				}
			},
			toggleView(mode) {
				this.viewMode = mode
				this.updateChart()
			},
			// 处理触摸事件
			touchStart(e) {
				if (chart && e.touches.length > 0) {
					const touch = e.touches[0]
					const handler = chart.getZr().handler
					handler.dispatch('mousedown', {
						zrX: touch.x,
						zrY: touch.y
					})
				}
			},
			touchMove(e) {
				if (chart && e.touches.length > 0) {
					const touch = e.touches[0]
					const handler = chart?.getZr()?.handler
					handler.dispatch('mousemove', {
						zrX: touch.x,
						zrY: touch.y
					})
				}
			},
			touchEnd(e) {
				if (chart) {
					const touch = e.changedTouches ? e.changedTouches[0] : {}

					const handler = chart.getZr().handler
					handler.dispatch('mouseup', {
						zrX: touch.x,
						zrY: touch.y
					})
				}
			}

		},
	}
</script>

<style>
	@import url("teacherIncome.css");
</style>