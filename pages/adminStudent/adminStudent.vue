<template>
	<view class="container">
		<!-- 学员搜索 -->
		<uni-search-bar placeholder="搜索学员" bgColor="#EEEEEE" @input="handleInput" @keypress="handleKeyPress" />
		<view class="student-list">
			<view class="student-card" v-for="(student,index) in studentList" :key="student.user_id">
				<view class="card-content">
					<image class="avatar" :src="student.avatar" mode="aspectFill"></image>
					<view class="info">

						<text class="nickName">{{student.user_id}}</text>
						<text class="course">{{student.nickName}}</text>
					</view>
					<view class="operate">
						<view class="modify" @click="modify(student.user_id)">
							修改
						</view>
						<view class="look" @click="look(student.user_id)">
							查看
						</view>
					</view>
					<view class="del-btn" @click="handleDelete(student.user_id)">
						<uni-icons type="trash" size="20" color="#ff0000"></uni-icons>
					</view>
				</view>

			</view>
		</view>
		<view class="add-btn" @click="addStudent">
			新增
		</view>
	</view>
</template>

<script>
	import {
		debounce
	} from 'lodash';
	import {
		adminStudent,
		admindelStudent,
		adminGetStudent,
		adminGetStudentDetail
	} from '../../api/admin';
	export default {
		data() {
			return {
				searchKeyword: '',
				studentList: [{
					id: '1',
					avator: 'https://img1.baidu.com/it/u=3082600848,2377791971&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
					nickName: '错雅鑫',
					phone: '13867675656',
					studentId: '1001',
					enrollDate: '2023-01-15'
				}],


			}
		},

		async created() {
			// 创建防抖函数（500ms延迟）
			this.debouncedInput = debounce(this.handleInput, 500);
			const res = await adminGetStudent()
			console.log(res)
			this.studentList = [...res]
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		methods: {
			showStudentDetail(studentId) {
				// 调取接口获取详情

			},
			modify(id) {
				console.log(id)
				uni.showToast({
					icon: 'loading',
					title: '加载中',
				})
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: `/pages/newStudent/newStudent?mode=modify&user_id=${id}`
					})
				}, 500)

			},
			look(id) {
				console.log(id)
				uni.showToast({
					icon: 'loading',
					title: '加载中',
				})
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: `/pages/newStudent/newStudent?mode=look&user_id=${id}`
					})
				}, 500)
			},
			async handleDelete(id) {
				// 调取接口删除学员
				console.log(id)
				const res = await admindelStudent({
					user_id: id
				})
				this.doSearch()

			},
			// 输入框实时防抖处理
			handleInput(e) {
				this.searchKeyword = e;
			},
			// 处理键盘事件
			handleKeyPress(e) {
				// 检查是否是回车键（keyCode 13 或 key 'Enter'）
				if (e.keyCode === 13 || e.key === 'Enter') {
					this.doSearch();
				}
			},
			// 实际搜索方法
			async doSearch() {
				const res = await adminGetStudent({
					keyword: this.searchKeyword
				})
				uni.showLoading({
					title: '搜索中...'
				});

				this.timer = setTimeout(() => {
					uni.hideLoading()
					this.studentList = [...res]
				}, 500)
				console.log(this.searchKeyword)
			},
			addStudent() {
				uni.showToast({
					icon: 'loading',
					title: '加载中',
				})
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: `/pages/newStudent/newStudent?mode=add`
					})
				}, 500)

			}


		}
	}
</script>


<style>
	@import url("adminStudent.css");
</style>