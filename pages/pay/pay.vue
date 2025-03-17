<template>
	<view class="pay-content">
		<view class="pay-content-top">
			<view class="pay-content-detail">
				<view class="pay-detail-head">
					<view class="pay-head-title">
						{{courseDetail.title}}
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
						{{`剩余${courseDetail.totalNumber - studentsNumber}名额拼满`}}
					</view>
				</view>
				<view class="pay-details-msg">
					<!-- txt -->
					<view class="pay-msg-time">
						{{`${courseDetail?.time?.startTime}~${courseDetail?.time?.endTime}`}}
					</view>
				</view>
				<view class="pay-details-msg">
					<!-- icon -->
					<uni-icons type="location" size="24"></uni-icons>
					<!-- txt -->
					<view class="pay-msg-txt">
						{{courseDetail.adress}}
					</view>
				</view>
			</view>
		</view>
		<view class="pay-content-bottom">
			<view class="pay-bottom-head">
				{{courseDetail.title}}
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
						@confirm="dialogInputConfirm" :before-close="isclosed">
						<view v-slot="value" class="pay-password">
							<input type="tel" password="password" @input="getPassword" :value="password"
								class="pay-password-input" />
						</view>
					</uni-popup-dialog>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCourseDetail
	} from '@/api/details.js'
	import {
		getLinkContent,
		checkPay
	} from '@/api/pay.js'
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				courseDetail: [],
				startTime: '',
				endTime: '',
				now: 0,
				studentsNumber: 0,
				ischecked: false,
				isvisible: false,
				linkContent: '',
				password: '',
				timer: null,
				isclosed: false

			}
		},
		onLoad(options) {
			this.getContentList(options.id)
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		computed: {
			...mapState('user', ['userInfo']),
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
			async getContentList(id) {
				const res = await getCourseDetail(id)
				const {
					data
				} = res
				this.courseDetail = data
				console.log(data);
				this.startTime = data?.time?.startTime
				this.endTime = data?.time?.endTime
				this.now = data?.time?.weeks[0].now
				this.studentsNumber = data?.students.length
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
				this.$refs.alertDialog.close()
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
				} = await checkPay(this.courseDetail.coursePrice, this.password, '2025')
				if (data?.isTrade) {
					uni.showToast({
						title: '支付成功',
						icon: "success",
						mask: true,
						duration: 200
					})
					this.isclosed = false
					this.password = ''
					this.timer = setTimeout(() => {
						uni.switchTab({
							url: '/pages/order/index'
						})
					}, 500)
				} else {
					uni.showToast({
						title: '密码错误,请重试',
						icon: "fail",
						mask: true,
						duration: 500
					})
					this.isclosed = true
					this.password = ''
				}
			},

			getPassword(e) {
				// 输入密码格式待校验
				if (e.detail.value.length === 6) {
					this.password = e.detail.value
				}
			}

		}
	}
</script>

<style>
	@import url(./pay.css);
</style>