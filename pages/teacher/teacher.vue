<template>
	<view class="user-content">
		<view class="user-content-top">
			<view class="user-avator">
				<view class="user-img">
					<image src="/static/logo.png"></image>
				</view>
				<!-- 未登录：立即登录；已登录：昵称 -->
				<view class="user-login">
					立即登录
				</view>
				<!-- <view class="user-nickName">
					昵称
				</view> -->
				<button class="user-switch" hover-class="user-switch-active">
					团长版
				</button>
			</view>
			<view class="user-amount">
				<view class="user-amount-txt">
					余额
				</view>
				<view class="user-amount-amount">
					10000
				</view>
			</view>
			<!-- 优惠券（有时间补充） -->
			<view class="user-join">
				<view class="user-join-txt">
					小区运动主理人
				</view>
				<view class="user-join-btn">
					立即加入
				</view>
			</view>
		</view>
		<view class="user-content-bottom">
			<view class="user-content-menu" v-for="item in 7" :key="item">
				<image src="/static/logo.png" class="user-menu-icon"></image>
				<view class="user-menu-title">
					我的订单
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	@import url(./teacher.css);
</style>