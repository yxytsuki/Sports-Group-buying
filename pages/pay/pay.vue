<template>
	<view class="pay-content">
		<view class="pay-content-top">
			<view class="pay-content-detail">
				<view class="pay-detail-head">
					<view class="pay-head-title">
						{{orderDetail.title}}
					</view>
					<view class="pay-head-status">
						进行中
					</view>
				</view>
				<view class="pay-detail-body">
					<view class="pay-detail-time">
						{{`总周期${getWeeks}期，当前第${now}周`}}
					</view>
					<view class="pay-detail-rest">
						{{`剩余${orderDetail?.totalNumber - studentsNumber}名额拼满`}}
					</view>
				</view>
				<view class="pay-details-msg">
					<!-- txt -->
					<view class="pay-msg-time">
						{{orderDetail?.creatTime}}
					</view>
				</view>
				<view class="pay-details-msg">
					<!-- icon -->
					<uni-icons type="location" size="24"></uni-icons>
					<!-- txt -->
					<view class="pay-msg-txt">
						{{orderDetail.adress}}
					</view>
				</view>
			</view>
		</view>
		<view class="pay-content-bottom">
			<view class="pay-bottom-head">
				{{orderDetail.title}}
			</view>
			<view class="pay-bottom-tips">
				温馨提示：
			</view>
			<view class="pay-bottom-agree">
				<label class="pay-agree-radio">
					<radio :checked="ischecked" @click="toggleChecked" />
				</label>

				<view class="pay-agree-txt">
					同意<span class="pay-agree-link" @click="showLink('info')">《跃动星球协议》</span>
				</view>
				<view>
					<!-- 提示窗示例 -->
					<uni-popup ref="alertDialog" type="dialog">
						<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="跃动星球协议"
							:content="linkContent" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
					</uni-popup>
				</view>
			</view>
			<view class="pay-bottom-pay" @click="confirmPay">
				确认支付
			</view>
			<view>
				<!-- 输入框示例 -->
				<uni-popup ref="inputDialog" type="dialog">
					<uni-popup-dialog ref="inputClose" mode="input" title="输入密码" placeholder="请输入密码"
						@confirm="dialogInputConfirm" @close="dialogClose" :before-close="isclosed">
						<template v-slot="value">
							<view class="pay-password">
								<input type="tel" password="password" maxlength="6" @input="getPassword"
									:value="password" class="pay-password-input" />
								<view class="pay-error-msg" v-if="isshowError">
									密码格式错误
								</view>
							</view>
						</template>

					</uni-popup-dialog>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getOrderDetail,
		getLinkContent,
		checkPay
	} from '@/api/pay.js'
	import {
		useUserStore
	} from '@/store/user.js'

	export default {
		data() {
			return {
				orderDetail: [],
				startTime: '',
				endTime: '',
				now: 0,
				studentsNumber: 0,
				ischecked: false,
				isvisible: false,
				linkContent: '',
				password: '',
				timer: null,
				isclosed: true,
				isshowError: false

			}
		},
		onLoad(options) {
			this.getContentList(options)
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		computed: {
			// 计算属性的getter
			getWeeks() {
				const start = new Date(this.startTime)
				const end = new Date(this.endTime)
				const diffTime = Math.abs(end - start)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
				const weeks = Math.ceil(diffDays / 7)
				return weeks
			}
		},
		methods: {
			async getContentList(param) {
				const res = await getOrderDetail(param)
				const {
					data
				} = res
				this.orderDetail = data
				console.log(data);
				this.startTime = data?.time?.startTime
				this.endTime = data?.time?.endTime
				this.now = data?.time?.weeks.now
				this.studentsNumber = data?.students.length
				console.log(this.studentsNumber);
			},
			toggleChecked() {
				this.ischecked = !this.ischecked
			},
			async showLink(type) {
				const {
					data
				} = await getLinkContent()
				this.linkContent = data.content
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			dialogConfirm() {
				this.ischecked = true
			},
			dialogClose() {
				this.$refs.inputDialog.close()
			},
			confirmPay() {
				if (!this.ischecked) {
					this.showLink()
					return
				}
				// 支付密码弹窗打开
				this.$refs.inputDialog.open()
			},
			async dialogInputConfirm() {
				// 密码校验 支付接口（金额、用户、密码）仓库
				const {
					data
				} = await checkPay(this.orderDetail.amount, this.password, useUserStore().userInfo.userId)
				if (data?.isTrade) {
					uni.showToast({
						title: '支付成功',
						icon: "success",
						mask: true,
						duration: 200
					})
					this.isclosed = false
					this.password = ''
					this.$refs.inputDialog.close()
					this.timer = setTimeout(() => {
						uni.switchTab({
							url: '/pages/order/index'
						})
					}, 500)
				} else {
					uni.showToast({
						title: '密码错误，请重试',
						icon: "error",
						mask: true,
						duration: 500
					})
					this.password = ''
				}
			},

			getPassword(e) {
				// 校验输入密码格式
				this.isvalidator(e.detail.value);
				if (e.detail.value.length === 6) {
					this.password = e.detail.value
				}
			},
			isvalidator(password) {
				const regex = /^\d{6}$/;
				if (!regex.test(password)) {
					this.isshowError = true
				} else {
					this.isshowError = false
				}
			}

		}
	}
</script>

<style>
	@import url(./pay.css);
</style>