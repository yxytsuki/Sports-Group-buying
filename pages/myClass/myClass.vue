<template>
	<view class="myClass-content">
		<view class="myClass-tabs">
			<view class="myClass-filterTabs">
				<uni-segmented-control :current="current" :values="filterTabs" style-type="text"
					@clickItem="onClickItem" activeColor="#4cd964"></uni-segmented-control>
			</view>
		</view>
		<view class="myClass-item-list">
			<view class="myClass-item-item" v-for="(item,index) in orderItem" :key="index">
				<classListItem :classListItem="item"></classListItem>
			</view>
		</view>
	</view>
</template>

<script>
	import classListItem from '../../components/classListItem/classListItem.vue';
	import {
		getMyClass
	} from '../../api/teacher';
	import {
		useUserStore
	} from '../../store/user';
	export default {
		components: {
			classListItem,
		},
		data() {
			return {
				filterTabs: ['全部', '拼班中', ' 已完成'],
				current: 0,
				orderItem: [],
				now: Date.now(),
				filterData: []
			}
		},
		created() {
			this.getClassContent()
		},

		methods: {
			async getClassContent() {
				const res = await getMyClass({
					teacher_id: useUserStore().userInfo.user_id
				})
				console.log('查询结果', res)
				this.orderItem = res
				this.filterData = res

			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if (this.current === 1) {
					this.orderItem = this.filterData.filter(item => item.end_time >= this.now);
				}
				if (this.current === 2) {
					this.orderItem = this.filterData.filter(item => item.end_time < this.now);
				}
			}



		}
	}
</script>

<style>
	@import url(./myClass.css);
</style>