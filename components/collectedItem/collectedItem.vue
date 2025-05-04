<template>
	<view class="collected-course" @click="jumpCourseDetail(course.cardItemId)">
		<!-- 背景 -->
		<view class="collected-backgroundImg">
			<image :src="course.backgroundImage" mode="aspectFill"></image>
			<view class="collected-distance">
				{{`${course.distance}km`}}
			</view>
		</view>
		<view class="collected-detail">
			<!-- 标题 -->
			<view class="collected-title">
				{{course.title}}
			</view>
			<!-- 介绍 -->
			<view class="collected-instruction">
				{{course.courseMsg}}
			</view>
		</view>
		<view :class="course.isRunning?'collected-status':'collected-unstatus'">
			{{course.isRunning?'进行中':'已结束'}}
		</view>
	</view>
</template>

<script>
	import {
		collected
	} from '../../api/details';

	export default {
		props: {
			course: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		name: "collectedItem",
		onLoad() {
			console.log(course)
		},
		onUnload() {
			clearTimeout(timer)
		},
		data() {
			return {

			};
		},
		methods: {
			jumpCourseDetail(id) {
				console.log(id)
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

			}
		}
	}
</script>

<style>
	@import url(./collectedItem.css);
</style>