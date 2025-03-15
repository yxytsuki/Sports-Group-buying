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
						<image class="teacher-user-img" src="/static/logo.png"></image>
					</view>
					<view class="teacher-user-nickName">
						大白兔奶糖
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
						1000.00
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
							1315.00元
						</view>
					</view>
					<view class="teacher-top-right">
						<view class="teacher-today-txt">
							今日订单
						</view>
						<view class="teacher-today-number">
							211笔
						</view>
					</view>
				</view>
				<view class="teacher-today-bottom">
					<view class="teacher-bottom-left">
						<uni-icons class="teacher-left-icon" type="wallet-filled" size="30"></uni-icons>
						<view class="teacher-left-totalAmount">
							13335.00元
							<view class="teacher-left-totalIncome">
								累计收入
							</view>
						</view>
					</view>
					<view class="teacher-bottom-right">
						<uni-icons class="teacher-left-icon" type="wallet-filled" size="30"></uni-icons>
						<view class="teacher-left-totalAmount">
							13335.00元
							<view class="teacher-left-totalIncome">
								可用余额
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="teacher-content-set">
			<view class="teacher-set-student">
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
			<view class="teacher-set-order">
				<view class="teacher-order-txt">
					<view class="teacher-order-title">
						订单管理
					</view>
					<view class="teacher-order-manage">
						查看与管理订单
					</view>
				</view>
				<view class="teacher-order-icon">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isVisible: false

			}
		},
		methods: {
			handleVisible() {
				this.$data.isVisible = !this.$data.isVisible
			}

		}
	}
</script>

<style>
	@import url(./teacherIndex.css);
</style>