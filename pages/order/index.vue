<template>
	<view class="order-content">
		<view class="order-tabs">
			<view class="order-filterTabs">
				<uni-segmented-control :current="current" :values="filterTabs" style-type="text" activeColor="#4cd964"
					@clickItem="onClickItem"></uni-segmented-control>
			</view>
		</view>
		<view class="order-item-list">
			<view class="order-item-item" v-for="(item,index) in orderList" :key="item.order_id">
				<orderListItem :orderItem="item"></orderListItem>
			</view>
		</view>
	</view>
</template>

<script>
	import orderListItem from '../../components/orderListItem/orderListItem.vue';
	import {
		getFilterOrder
	} from '@/api/order.js'
	import {
		useUserStore
	} from '../../store/user';
	import {
		useAuth
	} from '@/utils/getUserInfo.js'
	export default {
		components: {
			orderListItem,
		},
		onReady() {
			this.getOrderContent()
			const {
				isLogin
			} = useAuth()
			if (!isLogin()) {
				console.log('未登录，已跳转')
			} else {
				console.log('已登录，继续执行业务逻辑')
			}
		},
		data() {
			return {
				filterTabs: ['全部', '待支付', '拼班中', '已完成'],
				current: 0,
				orderList: [],
				isFinited: false,
				user_id: useUserStore().userInfo.user_id
			}
		},
		methods: {
			async getOrderContent() {
				const data = await getFilterOrder({
					userId: this.user_id
				})
				console.log(data)
				this.orderList = data.list
				console.log(this.orderList)
			},
			async onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
					console.log(this.current)
					const filterData = await getFilterOrder({
						userId: this.user_id,
						current: this.current
					})

					console.log(filterData)
					this.orderList = [...filterData?.list] || []

				}
			},



		}
	}
</script>

<style>
	@import url(./index.css);
</style>