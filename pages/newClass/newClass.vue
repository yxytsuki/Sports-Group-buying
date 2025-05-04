<template>
	<view class="public-container">
		<uni-forms ref="form" :modelValue="formData" :rules="rules">
			<!-- 课程名称 -->
			<uni-forms-item label="课程名称" name="courseName" required>
				<uni-easyinput v-model="formData.courseName" placeholder="请输入课程名称" />

			</uni-forms-item>
			<!-- 课程介绍 -->
			<uni-forms-item label="课程介绍" name="courseDesc" required>
				<uni-easyinput v-model="formData.courseDesc" placeholder="请输入课程介绍" />

			</uni-forms-item>
			<!-- 课程地点 -->
			<uni-forms-item label="课程地点" name="location" required>
				<uni-easyinput v-model="formData.location" placeholder="请输入课程地点" />

			</uni-forms-item>
			<!-- 课程背景图 -->
			<uni-forms-item label="课程背景" name="coverImage" required>
				<view class="image-upload">
					<image v-if="formData.coverImage" :src="formData.coverImage" mode="aspectFill"
						class="preview-image"></image>
					<view v-else class="upload-btn" @click="chooseImage">{{formData.coverImage?'更换图片':'上传图片'}}</view>
				</view>
			</uni-forms-item>
			<!-- 课程价格 -->
			<uni-forms-item label="课程价格" name="price" required>
				<uni-easyinput v-model="formData.price" type="number" placeholder="请输入课程价格" />

			</uni-forms-item>
			<!-- 课程说明 -->
			<uni-forms-item label="课程说明" name="courseNote">
				<uni-easyinput v-model="formData.courseNote" type="textarea" placeholder="请输入课程说明" />

			</uni-forms-item>
			<!-- 课程容量 -->
			<uni-forms-item label="课程容量" name="capacity" required>
				<uni-number-box v-model="formData.capacity" :min="1" :max="200" />

			</uni-forms-item>
			<!-- 课程开始日期 -->
			<uni-forms-item label="开始日期" name="startDate" required>
				<uni-datetime-picker v-model="formData.startDate" type="date" :clear-icon="false" />

			</uni-forms-item>
			<!-- 课程结束日期 -->
			<uni-forms-item label="结束日期" name="endDate" required>
				<uni-datetime-picker v-model="formData.endDate" type="date" :clear-icon="false" />

			</uni-forms-item>
			<!-- 上课时间（周几） -->
			<uni-forms-item label="上课时间" name="weekDays" required>
				<view class="week-days">
					<view v-for="(day,index) in weekDays" :key="index" class="week-day-item"
						:class="{active:formData.weekDays.includes(index)}" @click="toggleWeekDay(index)">
						{{day}}
					</view>
				</view>

			</uni-forms-item>
			<!-- 每天开始时间 -->
			<uni-forms-item label="开始时间" name="dailyStartTime" required>
				<view class="time-picker">
					<uni-datetime-picker v-model="formData.dailyStartTime" type="time" :clear-icon="false" />
				</view>

			</uni-forms-item>

			<!-- 每天结束时间 -->
			<uni-forms-item label="结束时间" name="dailyEndTime" required>
				<uni-datetime-picker v-model="formData.dailyEndTime" type="time" :clear-icon="false" />

			</uni-forms-item>
			<!-- 提交按钮 -->
			<view class="submit-btn">
				<button type="primary" @click="submitForm">发布课程</button>
			</view>
		</uni-forms>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				selectedStartTime: [], // 级联选择值
				timeData: [{
						label: '时',
						value: 'hour',
					},
					{
						label: '分',
						value: 'minute',
					},
					{
						label: '秒',
						value: 'second',
					},
				],
				formData: {
					courseName: '',
					courseDesc: '',
					location: '',
					coverImage: '',
					price: '',
					courseNote: '',
					capacity: '',
					startDate: '',
					endDate: '',
					weekDays: [],
					dailyStartTime: '',
					dailyEndTime: ''
				},
				rules: {
					courseName: {
						rules: [{
								'required': true,
								errorMessage: '请输入团课名称'
							},
							{
								maxLength: 20,
								errorMessage: '课程名称最多不超过20字符',
							}
						],
					},
					courseDesc: {
						rules: [{
							required: true,
							errorMessage: '请输入课程介绍'
						}]
					},
					location: {
						rules: [{
							required: true,
							errorMessage: '请输入课程地点'
						}]
					},
					coverImage: {
						rules: [{
							required: true,
							errorMessage: '请输入课程背景'
						}]
					},
					price: {
						rules: [{
								required: true,
								errorMessage: '请输入课程价格'
							},
							{
								validateFunction: (rule, value, data, callback) => {
									if (value === '' || value === null || value === undefined) {
										callback(); // 允许空值（由 required 规则处理）
										return;
									}

									// 检查是否为非负数
									if (Number(value) < 0) {
										callback('价格不能为负数');
										return;
									}

									// 检查是否最多两位小数
									if (!/^\d+(\.\d{1,2})?$/.test(value)) {
										callback('价格最多保留两位小数');
										return;
									}

									callback(); // 校验通过
								}
							}
						]
					},
					capacity: {
						rules: [{
							required: true,
							errorMessage: '请输入课程容量'
						}]
					},
					startDate: {
						rules: [{
								required: true,
								errorMessage: '请输入课程开始日期'
							},
							{
								validateFunction: (rule, value, data, callback) => {
									if (this.formData.startDate && this.formData.endDate && new Date(this.formData
											.startDate) > new Date(this.formData
											.endDate)) {
										callback('开始日期不能晚于结束日期');
									} else {
										callback(); // 校验通过
									}
								}
							}
						]
					},
					endDate: {
						rules: [{
							required: true,
							errorMessage: '请输入课程结束日期'
						}, ]
					},
					weekDays: {
						rules: [{
							required: true,
							errorMessage: '请选择上课时间'
						}]
					},
					dailyStartTime: {
						rules: [{
								required: true,
								errorMessage: '请选择开始时间'
							},
							{
								validateFunction: (rule, value, data, callback) => {
									if (this.formData.dailyStartTime && this.formData.dailyEndTime && new Date(this
											.formData.dailyStartTime) > new Date(this.formData.dailyEndTime)) {
										callback('开始时间不能晚于结束日期');
									} else {
										callback(); // 校验通过
									}
								}
							}
						]
					},
					dailyEndTime: {
						rules: [{
							required: true,
							errorMessage: '请选择结束时间'
						}]
					}

				}

			}
		},
		computed: {
			displayTime() {
				if (this.selectedStartTime && this.selectedStartTime.length === 3) {
					this.formData.dailyStartTime = this.selectedStartTime.join(':')
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
						this.formData.coverImage = res.tempFilePaths[0]
					}
				})
			},
			// 切换周几
			toggleWeekDay(index) {
				const weekDayIndex = this.formData.weekDays.indexOf(index)
				if (weekDayIndex === -1) {
					this.formData.weekDays.push(index)
				} else {
					this.formData.weekDays.splice(weekDayIndex, 1)
				}
				this.formData.weekDays.sort()
			},
			// 时间转换
			handleTimeChange(e) {
				if (e.detail.value.length === 3) {
					const [hour, minute, second] = e.detail.value
					this.formData.dailyStartTime = `${hour}:${minute}:${second}`
				}
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
	@import url("newClass.css");
</style>