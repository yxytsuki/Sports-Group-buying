<template>
	<view class="container">
		<!-- 搜索课程 -->
		<uni-search-bar placeholder="搜索课程" bgColor="#EEEEEE" @input="handleInput" @keypress="handleKeyPress" />
		<view class="course-item" v-for="(item,index) in courseList">
			<CardItem :course="item" />
		</view>
	</view>
</template>

<script>
	import CardItem from '@/components/collectedItem/collectedItem.vue'
	import {
		getCollectedCourse
	} from '@/api/collected.js'
	export default {
		components: {
			CardItem,
		},
		data() {
			return {
				courseList: []
			}
		},
		created() {
			// 创建防抖函数（500ms延迟）
			this.debouncedInput = debounce(this.handleInput, 500);
		},
		async onLoad() {
			const res = await getCollectedCourse()
			this.courseList = [...res?.data?.collectedCourse]
			console.log(this.courseList)
		},
		methods: {
			// 输入框实时防抖处理
			handleInput(e) {
				this.searchKeyword = e;
			}, // 处理键盘事件
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
	@import url('./collected.css');
</style>