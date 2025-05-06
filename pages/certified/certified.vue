<template>
	<view class="public-container">
		<uni-forms ref="form" :modelValue="formData">
			<!-- 昵称 -->
			<uni-forms-item label="昵称" name="nickName">
				<uni-easyinput v-model="formData.nickName" placeholder="请输入昵称" />
			</uni-forms-item>
			<!-- 头像 -->
			<uni-forms-item label="头像" name="avatar">
				<view class="image-upload">
					<image v-if="formData.avatar" :src="formData.avatar" mode="aspectFill" class="preview-image">
					</image>
					<view v-else class="upload-btn" @click="chooseImage">{{formData.avatar?'更换图片':'上传图片'}}</view>
				</view>
			</uni-forms-item>
			<!-- 支付密码 -->
			<uni-forms-item label="支付密码" name="password">
				<uni-easyinput v-model="formData.password" maxlength="6" type="password" placeholder="请输入支付密码"
					@input="handleInputPassword" />
				<view v-if="isshowError" class="password-error">
					密码格式错误
				</view>

			</uni-forms-item>
			<uni-forms-item label="确认支付密码" name="password">
				<uni-easyinput v-model="formData.confirmPassword" @input="handleInput" maxlength="6" type="password"
					placeholder="请输入确认支付密码" />
				<view v-if="isconfirm" class="password-error">
					支付密码不一致
				</view>
			</uni-forms-item>
			<!-- 个人介绍 -->
			<uni-forms-item label="个人介绍" name="personDesc">
				<uni-easyinput type="textarea" v-model="formData.personDesc" placeholder="请输入个人介绍" />

			</uni-forms-item>
			<!-- 提交按钮 -->
			<view class="submit-btn">
				<button type="primary" @click="submitForm">修改信息</button>
			</view>
		</uni-forms>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					nickName: '',
					personDesc: '',
					password: '',
					confirmPassword: '',
					avatar: '',
					isshowError: false,
					isconfirm: false
				},
				rules: {
					nickName: {
						rules: [{
								'required': false,
								errorMessage: '请输入昵称'
							},
							{
								maxLength: 20,
								errorMessage: '课程名称最多不超过20字符',
							}
						],
					},
					personDesc: {
						rules: [{
							required: false,
							errorMessage: '请输入个人介绍'
						}]
					},
					password: {
						rules: [{
								required: false,
								errorMessage: '请输入支付密码'
							},
							{
								maxLength: 6,
								errorMessage: '密码最多不超过6字符',
							}
						]
					},

				}


			}
		},
		methods: {
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.formData.avatar = res.tempFilePaths[0]
					}
				})
			},
			// 密码校验
			isvalidator(password) {
				const regex = /^\d{6}$/;
				if (!regex.test(password)) {
					this.isshowError = true
				} else {
					this.isshowError = false
				}
			},
			isvalidatorConfirmPassword(password) {
				if (password !== this.formData.password) {
					this.isconfirm = true
				} else {
					this.isconfirm = false
				}
			},
			// 输入
			handleInputPassword(e) {
				this.isvalidator(e)
			},
			handleInput(e) {
				this.isvalidatorConfirmPassword(e)
			},
			// 提交表单
			submitForm() {
				this.$refs.form.validate().then(res => {
					console.log('表单数据', this.formData)
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					})
					uni.navigateTo({
						url: 'pages/myClass/myClass'
					})
				}).catch(err => {
					console.log('表单错误', err)
				})
			}


		}
	}
</script>

<style>
	@import url("certified.css");
</style>