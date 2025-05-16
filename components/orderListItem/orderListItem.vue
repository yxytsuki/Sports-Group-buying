<template>
	<view class="order-item">
		<view class="order-title">
			<span class="order-title-txt">{{orderItem?.title}}</span>
			<!-- 订单状态是相对于现在的时间 order-title-running -->
			<view :class="orderItem?.status==='拼班中'?'order-title-running':'order-title-status'">
				{{orderItem?.status}}
			</view>
		</view>
		<view class="order-content">
			<view class="order-content-msg">
				<view class="order-msg-time">
					{{`总周期${getWeeks}周 当前第${getWeekNumber(startTime,endTime,orderItem?.pay_time)}周`}}
				</view>
			</view>
			<view class="order-content-number">
				<view class="order-number-txt">
					订单号
				</view>
				<span class="order-number">{{orderItem?.order_number}}</span>
			</view>
			<view class="order-content-number">
				<view class="order-number-txt">
					支付方式
				</view>
				<span class="order-number">余额自动扣款</span>
			</view>
			<view class="order-content-number">
				<view class="order-number-txt">
					订单实付金额
				</view>
				<span class="order-number">{{`￥${orderItem?.amount}`}}</span>
			</view>
			<view class="order-content-number">
				<view class="order-number-txt">
					订单创建时间
				</view>
				<span class="order-number">{{formatTimestamp(create_time)}}</span>
			</view>
			<view class="order-status-btn" @click.stop="handleJump(orderItem?.orderId)" v-if="getButtonTxt">
				{{getButtonTxt}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "orderItem",
		props: {
			orderItem: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				overlap: 20,
				avatarList: [
					'/static/logo.png',
					'/static/logo.png',
					'/static/logo.png'
				],
				startTime: this.orderItem?.start_time || '',
				endTime: this.orderItem?.end_time || '',
				timer: null,
				create_time: this.orderItem?.order_createTime
			};
		},
		computed: {
			getWeeks() {
				const diffTime = Math.abs(this.endTime - this.startTime)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
				const weeks = Math.ceil(diffDays / 7)
				return weeks
			},
			getButtonTxt() {
				if (!this.orderItem?.time?.weeks?.isRunning) {
					return '去评价'
				}
				if (!this.orderItem?.isPay && this.orderItem?.time?.weeks?.isRunning) {
					return '去支付'
				}
				return '已支付'
			}
		},
		methods: {
			// 将毫秒时间戳转化为日期格式
			formatTimestamp(timestamp) {
				const date = new Date(timestamp);
				const Y = date.getFullYear();
				const M = String(date.getMonth() + 1).padStart(2, '0');
				const D = String(date.getDate()).padStart(2, '0');
				const h = String(date.getHours()).padStart(2, '0');
				const m = String(date.getMinutes()).padStart(2, '0');
				const s = String(date.getSeconds()).padStart(2, '0');

				return `${Y}-${M}-${D} ${h}:${m}:${s}`;
			},
			handleJump(id) {
				if (this.getButtonTxt === '去评价') {
					console.log('去评价');
				}
				if (this.getButtonTxt === '去支付') {
					uni.showToast({
						title: "跳转中...",
						icon: "loading",
						mask: true,
						duration: 500
					})
					this.timer = setTimeout(() => {
						// 模糊查询 课程ID 或者orderID
						uni.navigateTo({
							url: `/pages/pay/pay?orderId=${id}`
						})
					}, 500)
				}
			},
			getWeekNumber(startTime, endTime, payTime) {
				const weekMillis = 7 * 24 * 60 * 60 * 1000;
				if (payTime < startTime || payTime > endTime) {
					return null;
				}
				const diff = payTime - startTime;
				const weekIndex = Math.floor(diff / weekMillis) + 1;

				return weekIndex;
			}



		},
		onUnload() {
			clearTimeout(this.timer)
		}
	}
</script>

<style>
	@import url("orderListItem.css");
</style>