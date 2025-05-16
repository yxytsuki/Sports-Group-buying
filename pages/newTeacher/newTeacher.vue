<template>
	<view class="public-container">
		<uni-forms ref="form" :modelValue="formData">
			<!-- ID -->
			<uni-forms-item label="教练id" name="stuId" required="true">
				<uni-easyinput :disabled="isdisabled" maxlength="10" v-model="formData.stuId" placeholder="请输入教练id" />
			</uni-forms-item>
			<!-- 昵称 -->
			<uni-forms-item label="昵称" name="nickName">
				<uni-easyinput :disabled="isdisabled" maxlength="20" v-model="formData.nickName"
					placeholder="请输入教练昵称" />
			</uni-forms-item>
			<!-- 姓名 -->
			<uni-forms-item label="姓名" name="user_name" required="true">
				<uni-easyinput :disabled="isdisabled" maxlength="20" v-model="formData.user_name"
					placeholder="请输入教练昵称" />
			</uni-forms-item>
			<!-- 账号 -->
			<uni-forms-item label="账号" name="phone" required="true">
				<uni-easyinput maxlength="11" :disabled="isdisabled" v-model="formData.phone" placeholder="请输入教练账号" />
			</uni-forms-item>
			<!-- 头像 -->
			<uni-forms-item label="教练头像" name="avatar">
				<view class="image-upload">
					<image v-if="formData.avatar" :src="formData.avatar" mode="aspectFill" class="preview-image">
					</image>
					<view v-else class="upload-btn" @click="chooseImage">{{formData.avatar?'更换图片':'上传图片'}}</view>
				</view>
			</uni-forms-item>
			<!-- 支付密码 -->
			<uni-forms-item label="支付密码" name="password" required="true">
				<uni-easyinput :disabled="isdisabled" v-model="formData.password" maxlength="6" type="password"
					placeholder="请输入教练支付密码" @input="handleInputPassword" />
				<view v-if="isshowError" class="password-error">
					密码格式错误
				</view>

			</uni-forms-item>
			<!-- 支付密码 -->
			<uni-forms-item label="余额" name="amount" required="true">
				<uni-easyinput :disabled="isdisabled" v-model="formData.amount" placeholder="请输入教练余额"
					@input="handleInputPassword" />

			</uni-forms-item>
			<!-- 个人介绍 -->
			<uni-forms-item label="教练介绍" name="personDesc">
				<uni-easyinput :disabled="isdisabled" type="textarea" v-model="formData.personDesc"
					placeholder="请输入教练介绍" />

			</uni-forms-item>
			<!-- 提交按钮 -->
			<view class="submit-btn">
				<button :disabled="isdisabled" type="primary" @click="submitForm">提交</button>
			</view>
		</uni-forms>


	</view>
</template>

<script>
	import {
		MODEENUM
	} from '../../utils/modeEnum'
	import {
		adminGetStudentDetail
	} from '../../api/admin'
	import {
		addStudent
	} from '../../api/student'
	export default {
		data() {
			return {
				tempAvatarPath: '', //存放头像临时路径
				formData: {
					stuId: '',
					nickName: '',
					personDesc: '',
					password: '',
					confirmPassword: '',
					avatar: '',
					amount: '',
					user_name: '',
					phone: '',
					isshowError: false,
					isconfirm: false,
					isdisabled: false,
					isshowDetail: false
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
					user_id: {
						rules: [{
								'required': false,
								errorMessage: '请输入姓名'
							},
							{
								maxLength: 10,
								errorMessage: '姓名最多不超过10字符',
							}
						],
					},
					phone: {
						rules: [{
								'required': false,
								errorMessage: '请输入手机号'
							},
							{
								maxLength: 11,
								errorMessage: '手机号最多不超过11字符',
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
		async onLoad(options) {
			console.log(options)
			console.log('mode', options.mode)
			if (MODEENUM.MODIFY === options.mode || MODEENUM.LOOK === options.mode) {
				const res = await adminGetStudentDetail({
					user_id: options.user_id,
				})
				console.log(res)
				this.formData.stuId = options.user_id
				this.formData.nickName = res.nickName
				this.formData.personDesc = res.description || ''
				this.formData.password = res.password
				this.formData.amount = res.amount
				if (MODEENUM.LOOK === options.mode) {
					this.formData.avatar = res.avatar
					this.isdisabled = true
				}
			}

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
			submitForm() {
				this.$refs.form.validate().then(res => {
					console.log('表单数据', this.formData)
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					})
					uni.navigateBack({
						url: 'pages/myClass/myClass'
					})
				}).catch(err => {
					console.log('表单错误', err)
				})
			},
			async submitForm() {
				try {
					await this.$refs.form.validate(); // 等待验证通过

					const res = await addStudent({
						user_id: this.formData.stuId,
						user_name: this.formData.user_name,
						phone: this.formData.phone,
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
							url: '/pages/adminStudent/adminStudent'
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
	@import url("../modify/modify.css");
</style>