<template>
	<view class="container">
		<!-- 学员搜索 -->
		<uni-search-bar placeholder="搜索学员" bgColor="#EEEEEE" @input="handleInput" @keypress="handleKeyPress" />
		<view class="student-list">
			<view class="student-card" v-for="(student,index) in studentList" :key="student.id"
				@click="showStudentDetail(student.id)">
				<view class="card-content">
					<image class="avatar" :src="student.avator" mode="aspectFill"></image>
					<view class="info">
						<text class="nickName">{{student.nickName}}</text>
						<text class="course">{{student.course}}</text>
					</view>
					<view class="del-btn">
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
						<image class="detail-avatar" :src="currentStudent.avator" mode="aspectFill"></image>
					</view>
					<view class="detail-item">
						<text class="label">昵称：</text>
						<text class="value">{{currentStudent.course}}</text>
					</view>
					<view class="detail-item">
						<text class="label">学号：</text>
						<text class="value">{{currentStudent.studentId}}</text>
					</view>
					<view class="detail-item">
						<text class="label">入学时间：</text>
						<text class="value">{{currentStudent.enrollDate}}</text>
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
	export default {
		data() {
			return {
				searchKeyword: '',
				studentList: [{
					id: '1',
					avator: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.DKmpcLgUKomMwmU8B4gbpAAAAA?w=191&h=191&c=7&r=0&o=7&cb=iwp1&dpr=1.5&pid=1.7&rm=3',
					nickName: '张三',
					course: '篮球培训班',
					phone: '13867675656',
					studentId: '1001',
					enrollDate: '2023-01-15'
				}],
				currentStudent: {
					id: '1',
					avator: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.DKmpcLgUKomMwmU8B4gbpAAAAA?w=191&h=191&c=7&r=0&o=7&cb=iwp1&dpr=1.5&pid=1.7&rm=3',
					nickName: '张三',
					course: '篮球培训班',
					phone: '13867675656',
					studentId: '1001',
					enrollDate: '2023-01-15'
				}

			}
		},

		created() {
			// 创建防抖函数（500ms延迟）
			this.debouncedInput = debounce(this.handleInput, 500);
		},
		methods: {
			showStudentDetail(studentId) {
				// 调取接口获取详情
				this.$refs.detailPopup.open()
			},
			closePopup() {
				this.$refs.detailPopup.close()
			},
			handleDelete(index) {
				// 调取接口删除学员
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
			doSearch() {

				uni.showLoading({
					title: '搜索中...'
				});
				console.log(this.searchKeyword)
			}


		}
	}
</script>


<style>
	@import url('./studentSet.css');
</style>