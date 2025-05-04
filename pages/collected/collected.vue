<template>
	<view class="container">
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
		async onLoad() {
			const res = await getCollectedCourse()
			this.courseList = [...res?.data?.collectedCourse]
			console.log(this.courseList)
		},
		methods: {

		}
	}
</script>

<style>
	@import url('./collected.css');
</style>