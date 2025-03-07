<template>
	<view class="cardContent">
		<view class="top">
			<image src="/static/logo.png" class="cource-img"></image>
			<view class="title">
				<text>羽毛球培训课</text>
			</view>
		</view>
		<view class="bottom">
			<view class="course-position">
				<uni-icons type="map-pin-ellipse" class="course-positionIcon"></uni-icons>
				<span class="course-position-txt">下沙高教公园</span>
			</view>
			<view class="course-time">
				<uni-icons type="map-pin-ellipse" class="course-positionIcon"></uni-icons>
				<span class="course-position-txt">下沙高教公园</span>
			</view>
			<view class="course-class">
				<uni-icons type="map-pin-ellipse" class="course-positionIcon"></uni-icons>
				<span class="course-position-txt">下沙高教公园</span>
			</view>
			<view class="course-number">
				<span>满5成班</span>
			</view>
			<view class="course-msg">
				<span class="course-join-number">0/20</span>
				<button class="course-action-btn" type="primary">去拼班</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "cartItem",
		data() {
			return {

			};
		}
	}
</script>

<style>
	@import url("cardItem.css");
</style>