<template>
	<view class="order-content">
		<view class="order-tabs">
			<view class="order-filterTabs">
				<uni-segmented-control :current="current" :values="filterTabs" style-type="text" activeColor="#4cd964"
					@clickItem="onClickItem"></uni-segmented-control>
			</view>
		</view>
		<view class="order-item-list">
			<view class="order-item-item" v-for="(item,index) in orderList" :key="item.orderId">
				<orderListItem :orderItem="item"></orderListItem>
			</view>
		</view>
	</view>
</template>

<script>
	import orderListItem from '../../components/orderListItem/orderListItem.vue';
	import {
		getOrderList,
		getFilterOrder
	} from '@/api/order.js'
	export default {
		components: {
			orderListItem,
		},
		onReady() {
			this.getOrderContent()
		},
		data() {
			return {
				filterTabs: ['全部', '待支付', '拼班中', '已完成'],
				current: 0,
				orderList: [],
				isFinited: false
			}
		},
		methods: {
			async getOrderContent() {
				const {
					data: {
						orderList,
					}
				} = await getOrderList()
				console.log(orderList);
				this.orderList = orderList
			},
			async onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
					const filterData = await getFilterOrder(this.current)
					const {
						data
					} = filterData
					const {
						orderList
					} = data
					console.log(orderList);
					this.orderList = [...orderList]

				}
			},



		}
	}
</script>

<style>
	@import url(./index.css);
</style>