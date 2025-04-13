<template>
	<view class="teacher-content">
		<view class="teacher-content-top">
			<view class="teacher-top-center">
				跃动星球教练中心
			</view>
			<view class="teacher-card-position">
				<uni-icons type="location-filled" size="30"></uni-icons>
				<view class="teahcer-position-txt">
					长沙
				</view>
			</view>
			<view class="teacher-top-card">
				<image src="/static/icon/ball.png" class="teacher-card-img"></image>
				<view class="teacher-card-user">
					<view class="teacher-user-avator">
						<image class="teacher-user-img" :src="avator"></image>
					</view>
					<view class="teacher-user-nickName">
						{{nickName}}
					</view>
				</view>
				<view class="teacher-card-amount">
					<view class="teacher-amount-txt">
						<view class="teacher-txt-txt">
							可用余额（元）
						</view>
						<!-- 可见 -->
						<view v-if="isVisible" class="teacher-amount-visible" @click="handleVisible">

						</view>
						<!-- 不可见 -->
						<view v-if="!isVisible" class="teacher-amount-isvisible" @click="handleVisible">

						</view>
					</view>

					<view class="teacher-amount-amount" v-if="isVisible">
						{{amount}}
					</view>
					<view class="teacher-amount-amount" v-if="!isVisible">
						*****
					</view>
				</view>
			</view>
		</view>
		<view class="teacher-content-income">
			<view class="teacher-income-today">
				<view class="teacher-today-top">
					<view class="teacher-top-left">
						<view class="teacher-today-txt">
							今日收入
						</view>
						<view class="teacher-today-amount">
							{{`${todayIncome}元`}}
						</view>
					</view>
					<view class="teacher-top-right">
						<view class="teacher-today-txt">
							今日订单
						</view>
						<view class="teacher-today-number">
							{{`${todayOrder}笔`}}
						</view>
					</view>
				</view>
				<view class="teacher-today-bottom">
					<view class="teacher-bottom-left">
						<uni-icons class="teacher-left-icon" type="wallet-filled" size="30"></uni-icons>
						<view class="teacher-left-totalAmount">
							{{`${totalIncome}元`}}
							<view class="teacher-left-totalIncome">
								累计收入
							</view>
						</view>
					</view>
					<view class="teacher-bottom-right">
						<uni-icons class="teacher-left-icon" type="wallet-filled" size="30"></uni-icons>
						<view class="teacher-left-totalAmount">
							{{`${amount}元`}}
							<view class="teacher-left-totalIncome">
								可用余额
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="teacher-content-set">
			<view class="teacher-set-student" @click="handleStudentSet">
				<view class="teacher-student-txt">
					<view class="teacher-student-title">
						学员管理
					</view>
					<view class="teacher-student-manage">
						查看与管理学员
					</view>
				</view>
				<view class="teacher-student-icon">
				</view>
			</view>
			<view class="teacher-set-order" @click="handleOrderSet">
				<view class="teacher-order-txt">
					<view class="teacher-order-title">
						拼班管理
					</view>
					<view class="teacher-order-manage">
						查看与管理拼班
					</view>
				</view>
				<view class="teacher-order-icon">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getTeacherIndex
	} from '@/api/teacher_index.js'
	import {
		useUserStore
	} from '@/store/user.js'
	import amap from '../../js_sdk/amap/amap-wx.130'
	export default {
		data() {
			return {
				isVisible: false,
				amount: '',
				todayIncome: '',
				todayOrder: 0,
				totalIncome: '',
				nickName: useUserStore().userInfo.nickName,
				avator: useUserStore().userInfo.avator,
				timer: null
			}
		},
		onReady() {
			// 获取教师版首页信息
			this.getTeacher()
			// 获取地理位置
			this.getLocation()

		},
		onUnload() {
			clearTimeout(this.timer)
		},
		methods: {
			handleVisible() {
				this.$data.isVisible = !this.$data.isVisible
			},
			// 获取地理位置
			getLocation() {
				const dom = new amap.AMapWX({
					key: "ae02e28d3e8ca8fd8cdec393417969a9"
				})
				dom.getRegeo({
					sucess: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
						uni.showToast({
							title: "获取地理位置失败",
							icon: "none"
						})
					}
				})
			},
			// 查询教师版首页信息
			async getTeacher() {
				const {
					data
				} = await getTeacherIndex()
				const {
					teacherMsg
				} = data
				console.log(teacherMsg)
				if (!data?.success) {
					uni.showToast({
						title: '暂无信息',
						icon: 'none'
					});
					return
				}
				this.amount = teacherMsg?.amount
				this.todayIncome = teacherMsg?.todayIncome
				this.todayOrder = teacherMsg?.todayOrder
				this.totalIncome = teacherMsg?.totalIncome

			},
			handleStudentSet() {
				uni.showToast({
					title: "跳转中...",
					icon: "loading",
					mask: true,
					duration: 500
				})
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: '/pages/studentSet/studentSet'
					})
				}, 500)

			},
			handleOrderSet() {
				uni.showToast({
					title: "跳转中...",
					icon: "loading",
					mask: true,
					duration: 500
				})
				this.timer = setTimeout(() => {
					uni.switchTab({
						url: '/pages/myClass/myClass'
					})
				}, 500)
			}

		}
	}
</script>

<style>
	@import url(./teacherIndex.css);
</style>