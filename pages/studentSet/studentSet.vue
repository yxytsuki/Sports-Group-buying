<template>
	<view class="container">
		<!-- 学员搜索 -->
		<uni-search-bar placeholder="搜索学员" bgColor="#EEEEEE" @input="handleInput" @keypress="handleKeyPress" />
		<view class="student-list">
			<view class="student-card" v-for="(student,index) in studentList" :key="student.id"
				@click="showStudentDetail(student.enrollment_id)">
				<view class="card-content">
					<image class="avatar" :src="student.avatar" mode="aspectFill"></image>
					<view class="info">
						<text class="nickName">{{student.nickName}}</text>
						<text class="course">{{student.title}}</text>
					</view>
					<view class="del-btn" @click.stop="handleDelete(student.enrollment_id)">
						<uni-icons type="trash" size="20" color="#ff0000"></uni-icons>
					</view>
				</view>

			</view>
		</view>
		<!-- 详情弹窗 -->
		<uni-popup ref="detailPopup" type="center">
			<view class="popup-content" v-if="currentStudent">
				<view class="popup-header">
					<text class="popup-title">学员详情</text>
					<view class="close-btn" @click="closePopup">
						<uni-icons type="close" size="20"></uni-icons>
					</view>
				</view>
				<view class="detail-info">
					<view class="detail-avatar">
						<image class="detail-avatar" :src="currentStudent.avatar" mode="aspectFill"></image>
					</view>
					<view class="detail-item">
						<text class="label">昵称：</text>
						<text class="value">{{currentStudent.nickName}}</text>
					</view>
					<view class="detail-item">
						<text class="label">学号：</text>
						<text class="value">{{currentStudent.student_id}}</text>
					</view>
					<view class="detail-item">
						<text class="label">入学时间：</text>
						<text class="value">{{currentStudent.enrollment_time}}</text>
					</view>
					<view class="detail-item">
						<text class="label">联系方式：</text>
						<text class="value">{{currentStudent.phone}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		debounce
	} from 'lodash';
	import {
		getStudentList,
		teacherStudentDetail,
		teacherStudent
	} from '../../api/student';
	import {
		useUserStore
	} from '../../store/user';
	export default {
		data() {
			return {
				teacherId: useUserStore().userInfo.user_id,
				searchKeyword: '',
				studentList: [],
				currentStudent: {}

			}
		},
		onUnload() {
			clearTimeout(this.timer)
		},

		async created() {
			// 创建防抖函数（500ms延迟）
			this.debouncedInput = debounce(this.handleInput, 500);
			const res = await getStudentList({
				teacher_id: this.teacherId
			})
			console.log(res)
			this.studentList = [...res]
		},
		methods: {
			async showStudentDetail(id) {
				console.log(id)
				// 调取接口获取详情
				const res = await teacherStudentDetail({
					enrollment_id: id
				})
				console.log(res)
				this.currentStudent = {
					enrollment_id: id,
					...res
				}
				console.log(this.currentStudent)
				this.$refs.detailPopup.open()
			},
			closePopup() {
				this.$refs.detailPopup.close()
			},
			async handleDelete(id) {
				console.log(id)
				// 调取接口删除学员
				const res = await teacherStudent({
					enrollment_id: id
				})
				console.log(res)
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
			// 搜索方法
			doSearch() {
				if (this.timer) {
					clearTimeout(this.timer);
				}

				this.timer = setTimeout(async () => {
					const res = await getStudentList({
						teacher_id: this.teacherId,
						keyword: this.searchKeyword
					});

					this.studentList = [...res] || [];

				}, 500);
			}



		}
	}
</script>


<style>
	@import url('./studentSet.css');
</style>