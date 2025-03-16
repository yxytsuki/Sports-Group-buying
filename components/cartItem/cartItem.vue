<template>
	<view class="cardContent">
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
				<button class="course-action-btn" type="primary">去拼班</button>
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

			};
		}
	}
</script>

<style>
	@import url("cardItem.css");
</style>