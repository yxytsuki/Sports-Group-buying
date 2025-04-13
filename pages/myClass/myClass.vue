<template>
	<view class="myClass-content">
		<view class="myClass-tabs">
			<view class="myClass-filterTabs">
				<uni-segmented-control :current="current" :values="filterTabs" style-type="text"
					activeColor="#4cd964"></uni-segmented-control>
			</view>
		</view>
		<view class="myClass-item-list">
			<view class="myClass-item-item" v-for="(item,index) in orderItem" :key="index">
				<classListItem></classListItem>
			</view>
		</view>
	</view>
</template>

<script>
	import classListItem from '../../components/classListItem/classListItem.vue';
	export default {
		components: {
			classListItem,
		},
		data() {
			return {
				filterTabs: ['全部', '拼班中', ' 已完成'],
				current: 0,
				orderItem: [1, 2, 3, 4, 5, 6]
			}
		},
		methods: {
			async getClassContent() {

			}

		}
	}
</script>

<style>
	@import url(./myClass.css);
</style>