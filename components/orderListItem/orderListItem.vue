<template>
	<view class="order-item">
		<view class="order-title">
			<span class="order-title-txt">{{orderItem?.title}}</span>
			<!-- 订单状态是相对于现在的时间 order-title-running -->
			<view :class="orderItem?.time?.weeks?.isRunning?'order-title-running':'order-title-status'">
				{{orderItem?.time?.weeks?.isRunning?'拼班中':'已完成'}}
			</view>
		</view>
		<view class="order-content">
			<view class="order-content-msg">
				<view class="order-msg-time">
					{{`总周期${getWeeks}周 当前第${orderItem?.time?.weeks?.week}周`}}
				</view>
			</view>
			<view class="order-content-number">
				<view class="order-number-txt">
					订单号
				</view>
				<span class="order-number">{{orderItem?.orderNumber}}</span>
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
				<span class="order-number">{{`${orderItem?.creatTime}`}}</span>
			</view>
			<view class="order-status-btn" @click.stop="handleJump(orderItem?.orderId)">
				{{orderItem?.isPay?'去评价':'去支付'}}
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
				startTime: this.orderItem?.time?.startTime || '',
				endTime: this.orderItem?.time?.endTime || '',
			};
		},
		computed: {
			getWeeks() {
				const start = new Date(this.startTime)
				const end = new Date(this.endTime)
				const diffTime = Math.abs(end - start)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
				const weeks = Math.ceil(diffDays / 7)
				return weeks
			}
		},
		methods: {
			handleJump(id) {
				if (this.orderItem?.isPay) {
					console.log('去评价');
				} else {
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
			}
		}
	}
</script>

<style>
	@import url("orderListItem.css");
</style>