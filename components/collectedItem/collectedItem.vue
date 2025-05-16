<template>
	<view class="collected-course" @click="jumpCourseDetail(course.course_id)">
		<!-- 背景 -->
		<view class="collected-backgroundImg">
			<image :src="course.background_image" mode="aspectFill"></image>
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
				{{cleanCourseMsg(course.course_msg)}}
			</view>
		</view>
		<view :class="course.is_running?'collected-status':'collected-unstatus'">
			{{course.is_running?'进行中':'已结束'}}
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
			console.log(11)
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
			cleanCourseMsg(msg) {
				// 清除换行
				return msg?.replace(/<br\s*\/?>/gi, ' ') || ''
			},
			jumpCourseDetail(id) {
				console.log(id)
				if (this.course.is_running) {
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