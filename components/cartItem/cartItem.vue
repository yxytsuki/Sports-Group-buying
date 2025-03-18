<template>
	<view class="cardContent" @click="jumpDetails(course.cardItemId)">
		<view class="cardMask" v-if="!course.isRunning">

		</view>
		<view class="top">
			<image :src="course.backgroundImage" class="cource-img"></image>
			<view class="title">
				<text>{{course.title}}</text>
			</view>
			<view class="course-distance">
				{{`${course.distance}km`}}
			</view>
		</view>
		<view class="bottom">
			<view class="course-position">
				<uni-icons type="map-pin-ellipse" class="course-positionIcon"></uni-icons>
				<span class="course-position-txt">{{course.address}}</span>
			</view>
			<view class="course-time">
				<uni-icons type="map-pin-ellipse" class="course-positionIcon"></uni-icons>
				<span
					class="course-position-txt">{{`${course?.time?.day}:${course?.time?.startTime}~${course?.time?.endTime}`}}</span>
			</view>
			<view class="course-class">
				<uni-icons type="map-pin-ellipse" class="course-positionIcon"></uni-icons>
				<span class="course-position-txt">{{`班级号${course.classNumber}`}}</span>
			</view>
			<view class="course-number">
				<span>{{`满${course.totalNumber}成班`}}</span>
			</view>
			<view class="course-msg">
				<span class="course-join-number">{{`0/${course.totalNumber}`}}</span>
				<button class="course-action-btn" type="primary" @click.stop="jumpPay(course.cardItemId)">去拼班</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			course: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		name: "cartItem",
		data() {
			return {
				timer: null,
				isButton: true
			};
		},
		methods: {
			jumpPay(id) {
				if (this.course.isRunning) {
					console.log(id);
					uni.showToast({
						title: "跳转中...",
						icon: "loading",
						mask: true,
						duration: 500
					})
					this.timer = setTimeout(() => {
						uni.navigateTo({
							url: `/pages/pay/pay?courseId=${id}`
						})
					}, 500)
				}

			},
			jumpDetails(id) {
				console.log(id);
				if (this.course.isRunning) {
					uni.showToast({
						title: "跳转中...",
						icon: "loading",
						mask: true,
						duration: 500
					})
					this.timer = setTimeout(() => {
						uni.navigateTo({
							url: `/pages/details/details?id=${id}`
						})
					}, 500)
				}

			},
		},
		destroyed() {
			console.log(11)
			clearTimeout(this.timer)
		}
	}
</script>

<style>
	@import url("cardItem.css");
</style>