<template>
	<view class="public-container">
		<uni-forms ref="form" :modelValue="formData">
			<!-- 昵称 -->
			<uni-forms-item label="昵称" name="nickName">
				<uni-easyinput maxlength="20" v-model="formData.nickName" placeholder="请输入昵称" />
			</uni-forms-item>
			<uni-forms-item label="姓名" name="userName">
				<uni-easyinput maxlength="10" v-model="formData.userName" placeholder="请输入姓名" />
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
	import {
		addStudent
	} from '../../api/student'
	import {
		useUserStore
	} from '/store/user.js'
	export default {
		data() {
			return {
				tempAvatarPath: '', //存放头像临时路径
				user_id: useUserStore().userInfo.user_id,
				formData: {
					nickName: '',
					userName: '',
					personDesc: '',
					password: '',
					confirmPassword: '',
					avatar: '',
					isshowError: false,
					isconfirm: false,

				},
				rules: {
					nickName: {
						rules: [{
								'required': false,
								errorMessage: '请输入昵称'
							},
							{
								maxLength: 10,
								errorMessage: '昵称最多不超过10字符',
							}
						],
					},
					userName: {
						rules: [{
								'required': false,
								errorMessage: '请输入姓名'
							},
							{
								maxLength: 10,
								errorMessage: '昵称最多不超过10字符',
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
		onUnload() {
			clearTimeout(this.timer)
		},
		methods: {
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1, //允许选择1张照片
					sizeType: ['compressed'], //压缩图片
					sourceType: ['album', 'camera'], //可从相册或相机选择
					success: (res) => {
						const tempPath = res.tempFilePaths[0];
						this.tempAvatarPath = tempPath;
						// 上传到服务器
						uni.uploadFile({
							url: 'http://localhost:3000/api/upload', // 改成你后台实际上传接口
							filePath: tempPath,
							name: 'avatar', // 后端接收的字段名
							success: (uploadRes) => {
								const responseData = JSON.parse(uploadRes.data);
								if (responseData.status === 200) {
									this.formData.avatar =
										`http://localhost:3000${responseData.url}`;
									console.log('真实路径')
									console.log(this.formData.avatar)
									uni.showToast({
										title: '上传成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: '上传失败',
										icon: 'error'
									});
								}
							},
							fail: () => {
								uni.showToast({
									title: '上传失败',
									icon: 'error'
								});
							}
						});
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
			async submitForm() {
				try {
					await this.$refs.form.validate(); // 等待验证通过

					const res = await addStudent({
						user_id: this.user_id,
						user_name: this.formData.userName,
						nickName: this.formData.nickName,
						avatar: this.formData.avatar,
						password: this.formData.password,
						description: this.formData.personDesc
					});

					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});
					console.log('结果')

					this.timer = setTimeout(() => {
						uni.reLaunch({
							url: '/pages/user/index'
						});
					}, 500)
				} catch (err) {
					console.log('表单错误', err);
				}
			}



		}
	}
</script>

<style>
	@import url("modify.css");
</style>