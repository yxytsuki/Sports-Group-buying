<template>
	<view class="user-content">
		<view class="user-content-top">
			<view class="user-avator">
				<view class="user-img">
					<image :src="avator"></image>
				</view>
				<!-- 未登录：立即登录；已登录：昵称 -->
				<view class="user-login" @click="handleLogin">
					{{isLogin?nickName:'立即登录'}}
				</view>
				<!-- <view class="user-nickName">
					昵称
				</view> -->
				<button class="user-switch" hover-class="user-switch-active" v-if="isLogin" @click="toggleRole">
					{{isteacher?'教练版':'学员版'}}
				</button>
			</view>
			<view class="user-amount" v-if="isLogin">
				<view class="user-amount-txt">
					余额
				</view>
				<view class="user-amount-amount">
					{{amount}}
				</view>
			</view>

			<view class="user-join">
				<view class="user-join-txt">
					小区运动主理人
				</view>
				<view class="user-join-btn" @click="joinTeacher">
					立即加入
				</view>
			</view>
		</view>
		<view class="user-content-bottom">
			<view class="user-content-menu" @click="jumpCollected">
				<image src="/static/icon/collected.png" class="user-menu-icon"></image>
				<view class="user-menu-title">
					我的收藏
				</view>
			</view>
			<view class="user-content-menu" @click="jumpModify">
				<image src="/static/icon/modify.png" class="user-menu-icon"></image>
				<view class="user-menu-title">
					修改信息
				</view>
			</view>
			<view class="user-content-menu" @click="logout">
				<image src="/static/icon/logout.png" class="user-menu-icon"></image>
				<view class="user-menu-title">
					退出登录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useUserStore
	} from '../../store/user';
	import {
		useAuth
	} from '@/utils/getUserInfo.js'
	import {
		getUser
	} from '/api/login.js'
	import {
		getlogout
	} from '../../api/login';
	export default {
		data() {
			return {
				isLogin: false,
				timer: null,
				nickName: useUserStore().userInfo.nickName,
				avator: useUserStore().userInfo.avatar,
				amount: '',
				isteacher: false,
				// 是否认证
				iscertified: false
			}
		},
		async onReady() {
			if (useUserStore().userInfo.token) {
				this.isLogin = true
				// 查询用户信息
				console.log(useUserStore().userInfo.userId)
				const data = await getUser(useUserStore().userInfo.user_id)
				console.log(data)
				const oldUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

				const newUserInfo = {
					...oldUserInfo, // 保留旧字段
					...data // 覆盖部分字段（只更新传回来的字段）
				};
				localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
				useUserStore().setUserInfo(localStorage.getItem('userInfo'))
				this.amount = data.amount
				this.isteacher = data.is_teacher
				this.iscertified = data.is_certified
				this.nickName = data.nickName
				this.avator = data.avatar
				console.log('图片')
				console.log(this.avator)
			}
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		methods: {
			handleLogin() {
				// 登陆前，跳转登陆页面 登陆采用手机号一键登录 先校验仓库有无token
				const token = useUserStore().userInfo.token
				if (!token) {
					uni.showToast({
						title: "跳转中...",
						icon: "loading",
						mask: true,
						duration: 500
					})
					this.timer = setTimeout(() => {
						uni.navigateTo({
							url: '/pages/getUserInfo/getUserInfo'
						})
					}, 500)

				}

			},
			async logout() {
				const res = await getlogout()
				console.log(res)
				localStorage.removeItem('userInfo');
				uni.navigateTo({
					url: '/pages/getUserInfo/getUserInfo'
				})
			},
			joinTeacher() {
				if (!this.iscertified) {
					console.log(this.iscertified)
					uni.showToast({
						title: "跳转中...",
						icon: "loading",
						mask: true,
						duration: 500
					})
					this.timer = setTimeout(() => {
						uni.navigateTo({
							url: "/pages/certified/certified"
						})
					}, 500)
				} else {
					uni.showToast({
						title: "已认证",
						icon: "none",
						mask: true,
						duration: 500
					})
				}
			},
			toggleRole() {
				this.isteacher = !this.isteacher
				const pageTeacher = [{
						page: '/pages/teacherIndex/teacherIndex',
						name: '首页',
						iconpath: '/static/icon/tabBar/home1.png',
						selectedIconPath: '/static/icon/tabBar/home.png'
					},
					{
						page: '/pages/group/index',
						name: '一键开团',
						iconpath: '/static/icon/tabBar/add1.png',
						selectedIconPath: '/static/icon/tabBar/add.png'
					},
					{
						page: '/pages/myClass/myClass',
						name: '我的拼班',
						iconpath: '/static/icon/tabBar/student1.png',
						selectedIconPath: '/static/icon/tabBar/student.png'
					},
					{
						page: '/pages/user/index',
						name: '我的',
						iconpath: '/static/icon/tabBar/honor1.png',
						selectedIconPath: '/static/icon/tabBar/honor.png'
					}
				]
				const pageStudent = [{
						page: '/pages/index/index',
						name: '首页',
						iconpath: '/static/resource/images/home1.png',
						selectedIconPath: '/static/resource/images/home2.png'
					},
					{
						page: '/pages/group/index',
						name: '一键开团',
						iconpath: '/static/resource/images/group1.png',
						selectedIconPath: '/static/resource/images/group2.png'
					},
					{
						page: '/pages/order/index',
						name: '我的订单',
						iconpath: '/static/resource/images/order1.png',
						selectedIconPath: '/static/resource/images/order2.png'
					},
					{
						page: '/pages/user/index',
						name: '我的',
						iconpath: '/static/resource/images/user1.png',
						selectedIconPath: '/static/resource/images/user2.png'
					}
				]
				if (this.isteacher) {
					pageTeacher.forEach((item, index) => {
						uni.setTabBarItem({
							index: index,
							pagePath: item.page,
							text: item.name,
							iconPath: item.iconpath,
							selectedIconPath: item.selectedIconPath
						})
					})
				} else {
					pageStudent.forEach((item, index) => {
						uni.setTabBarItem({
							index: index,
							pagePath: item.page,
							text: item.name,
							iconPath: item.iconpath,
							selectedIconPath: item.selectedIconPath
						})
					})
				}
			},
			jumpCollected() {
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: "/pages/collected/collected"
					})
				}, 500)
			},
			jumpModify() {
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: "/pages/modify/modify"
					})
				}, 500)
			}

		}
	}
</script>

<style>
	@import url(./index.css);
</style>