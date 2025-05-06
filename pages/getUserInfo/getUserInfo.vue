<template>
	<view class="login-content">
		<image src="/static/icon/ball.png" class="login-background-image"></image>
		<view class="login-phoneNumber-input">
			<uni-easyinput type="number" value="phone" @input="getPhoneNumber" @clear="clear" style="font-size: 16rpx;"
				maxlength="11" class="login-phoneNumber-input">
				<template #left>
					<view>+86</view>
				</template>
			</uni-easyinput>
		</view>
		<view class="login-code-input">
			<uni-easyinput type="number" value="loginCode" @input="codeInput" maxlength="6" class="login-code-input">
				<template #left>
					<view>验证码</view>
				</template>
				<template #right>
					<view class="login-code-second" @click="getCode">
						{{isgetCode?`${second}s`:getCodeTxt}}
					</view>
				</template>
			</uni-easyinput>
		</view>
		<view class="login-btn" @click="login">
			登录
		</view>
		<view>
			没有账号会自动注册
		</view>
	</view>
</template>

<script>
	import {
		getLoginCode,
		getLogin
	} from '../../api/login'
	import {
		useUserStore
	} from '../../store/user'
	export default {
		data() {
			return {
				totalSecond: 5,
				second: 5,
				isgetCode: false,
				getCodeTxt: '获取验证码',
				phone: '',
				loginCode: '',
				url: '',
				timer: null
			}
		},
		onLoad(options) {
			console.log(options)
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		methods: {
			getPhoneNumber(e) {
				this.phone = e
			},
			codeInput(e) {
				this.loginCode = e
			},
			clear() {
				this.phone = ''
			},
			validatePhoneNum(phoneNum) {
				const phoneReg = /^1[3-9]\d{9}$/
				if (phoneReg.test(phoneNum)) {
					return true
				} else {
					uni.showToast({
						title: "请输入正确的手机号",
						icon: "none"
					})
					return false
				}
			},
			validateCode(code) {
				const codeReg = /^\d{6}$/
				if (codeReg.test(code)) {
					return true
				} else {
					uni.showToast({
						title: "请输入正确的验证码",
						icon: "none"
					})
					return false
				}
			},
			// 倒计时
			async getCode() {
				if (!this.validatePhoneNum(this.phone)) {
					// 没通过校验return
					return
				}
				// 调用获取验证码的接口
				const {
					data: {
						code
					}
				} = await getLoginCode()
				uni.showModal({
					title: `验证码：${code}`
				})
				// 开启倒计时
				this.isgetCode = true
				if (!this.timer && this.second === this.totalSecond) {
					console.log(this.isgetCode)
					this.timer = setInterval(() => {
						this.second--
						if (this.second <= 0) {
							this.isgetCode = false
							clearInterval(this.timer)
							this.timer = null
							this.second = this.totalSecond
						}
					}, 1000)
				}
			},
			async login() {
				// 格式校验
				if (!this.validatePhoneNum(this.phone) && !this.validateCode(this.loginCode)) {
					return
				}
				// 登录接口
				const {
					data
				} = await getLogin(this.phone, this.loginCode)
				useUserStore().setUserInfo(data)
				uni.showToast({
					title: "登陆成功",
					icon: "success",
					mask: true,
					duration: 500
				})
				uni.setStorage({
					key: 'userInfo',
					data: JSON.stringify(data)
				})
				this.timer = setTimeout(() => {
					uni.switchTab({
						url: "/pages/user/index"
					})
				}, 500)

			}
		}
	}
</script>

<style lang="scss">
	@import url(./getUserInfo.css);
</style>