<template>
	<view class="order-item">
		<view class="order-title">
			<span class="order-title-txt">篮球启蒙班</span>
		</view>
		<view class="order-content">
			<view class="order-content-msg">
				<view class="order-msg-time">
					总周期16周 当前第5周
				</view>
			</view>
			<view class="order-content-number">
				<view class="order-number-txt">
					订单号
				</view>
				<span class="order-number">12345678910</span>
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
				<span class="order-number">￥59.00</span>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	export default {
		name: "orderItem",
		data() {
			return {
				overlap: 20,
				avatarList: [
					'/static/logo.png',
					'/static/logo.png',
					'/static/logo.png'
				]
			};
		}
	}
</script>

<style>
	@import url("orderListItem.css");
</style>