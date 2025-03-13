<template>
	<view class="pay-content">
		<view class="pay-content-top">
			<view class="pay-content-detail">
				<view class="pay-detail-head">
					<view class="pay-head-title">
						19.9体验课
					</view>
					<view class="pay-head-status">
						进行中
					</view>
				</view>
				<view class="pay-detail-body">
					<view class="pay-detail-time">
						总周期11期，当前第2周
					</view>
					<view class="pay-detail-rest">
						剩余1名额拼满
					</view>
				</view>
				<view class="pay-details-msg" v-for="item in 2" :key="item">
					<!-- icon -->
					<uni-icons type="location" size="24"></uni-icons>
					<!-- txt -->
					<view class="pay-msg-txt">
						三润城
					</view>
				</view>
			</view>
		</view>
		<view class="pay-content-bottom">
			<view class="pay-bottom-head">
				19.9体验课
			</view>
			<view class="pay-bottom-tips">
				温馨提示：
			</view>
			<view class="pay-bottom-agree">
				<label class="pay-agree-radio">
					<radio checked="" /><text></text>
				</label>
				<view class="pay-agree-txt">
					同意<span class="pay-agree-link">《跃动星球协议》</span>
				</view>
			</view>
			<view class="pay-bottom-pay">
				确认支付
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
	@import url(./pay.css);
</style>