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
		useUserStore
	} from '../../store/user'
	import {
		getCollectedCourse
	} from '@/api/collected.js'
	import {
		debounce
	} from 'lodash';
	export default {
		components: {
			CardItem,
		},
		data() {
			return {
				courseList: [],
				user_id: useUserStore().userInfo.user_id
			}
		},
		created() {
			// 创建防抖函数（500ms延迟）
			this.debouncedInput = debounce(this.handleInput, 500);
		},
		async onLoad() {
			const res = await getCollectedCourse({
				userId: this.user_id
			})
			console.log(res)
			this.courseList = res

		},
		methods: {
			// 输入框实时防抖处理
			handleInput(e) {
				this.searchKeyword = e;
			}, // 处理键盘事件
			handleKeyPress(e) {
				// 检查是否是回车键（keyCode 13 或 key 'Enter'）
				if (e.keyCode === 13 || e.key === 'Enter') {
					this.doSearch(e);
				}
			},
			// 实际搜索方法
			async doSearch() {
				const res = await getCollectedCourse({
					userId: this.user_id,
					keyword: this.searchKeyword
				})
				console.log(res)
				this.courseList = [...res]
			}
		}
	}
</script>

<style>
	@import url('./collected.css');
</style>