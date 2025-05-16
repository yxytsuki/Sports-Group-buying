<template>
	<view class="container">
		<view class="title">"跃动星球"管理菜单</view>
		<view class="menu-grid">
			<view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="goToPage(item.path)">
				<image :src="item.icon" class="icon" />
				<text class="label">{{ item.label }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [{
						label: '学员管理',
						path: '/pages/adminStudent/adminStudent',
						icon: '/static/icon/admin/student.png'
					},
					{
						label: '教练管理',
						path: '/pages/adminTeacher/adminTeacher',
						icon: '/static/icon/admin/teacher1.png'
					},
					{
						label: '订单管理',
						path: '/pages/admin/orders',
						icon: '/static/icon/admin/order.png'
					},
					{
						label: '课程管理',
						path: '/pages/admin/courses',
						icon: '/static/icon/admin/course.png'
					}
				]
			}
		},
		methods: {
			goToPage(path) {
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style scoped>
	.body {
		position: absolute;
		background-image: url(/static/icon/ball.png);
		width: 200rpx;
		height: 200rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.container {
		padding: 30rpx;

	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.menu-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.menu-item {
		width: 45%;
		background-color: #f2f2f2;
		border-radius: 20rpx;
		padding: 30rpx 0;
		text-align: center;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 15rpx;
	}

	.label {
		font-size: 28rpx;
	}
</style>