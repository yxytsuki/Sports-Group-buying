<template>
	<view class="group-content">
		<image src="/static/icon/ball.png" class="group-background-img"></image>
		<view class="group-content-title">
			欢迎来到跃动星球~
		</view>
		<view class="group-content-new">
			<image src="/static/icon/add-circle.png" class="group-content-icon"></image>
			<view class="group-new-title" @click="jumpNewClass">
				新建拼团
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useUserStore
	} from '../../store/user'
	export default {
		data() {
			return {

			}
		},
		methods: {
			onunload() {
				clearTimeout(timer)
			},
			jumpNewClass() {
				console.log(useUserStore().userInfo.is_teacher)
				if (!useUserStore().userInfo.is_teacher) {
					uni.showToast({
						title: "无权限",
						icon: "none",
						mask: true,
						duration: 500
					})
					return
				}
				uni.showToast({
					title: "跳转中...",
					icon: "loading",
					mask: true,
					duration: 500
				})
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: '/pages/newClass/newClass'
					})
				}, 500)
			}

		}
	}
</script>

<style>
	@import url(./index.css);
</style>