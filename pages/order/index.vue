<template>
	<view class="order-content">
		<view class="order-tabs">
			<view class="order-filterTabs">
				<uni-segmented-control :current="current" :values="filterTabs" style-type="text"
					activeColor="#4cd964"></uni-segmented-control>
			</view>
		</view>
		<view class="order-item-list">
			<ul>
				<li v-for="(item,index) in orderItem" :key="index">
					<orderListItem></orderListItem>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import orderListItem from '../../components/orderListItem/orderListItem.vue';
	export default {
		components: {
			orderListItem,
		},
		data() {
			return {
				filterTabs: ['全部', '待支付', '拼班中', '已完成'],
				current: 0,
				orderItem: [1, 2, 3, 4, 5, 6]

			}
		},
		methods: {

		}
	}
</script>

<style>
	@import url(./index.css);
</style>