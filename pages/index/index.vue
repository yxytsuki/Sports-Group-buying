<template>
	<view class="content">
		<view class="banner">
			<swiper :indicator-dots="true" :circular="true" :autoplay="true" :interval="3000" :duration="1000">
				<!-- 根据banner渲染 -->
				<swiper-item v-for="(item, index) in banner" :key="item.bannerId">
					<image class="banner-img" :src="item.bannerImage"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="body">
			<view class="tab">
				<view class="position-filterTabs">
					<view class="filterTabs">
						<uni-segmented-control :current="positionCurrent" :values="tabs" style-type="text"
							activeColor="#4cd964" @clickItem="handleToggle"></uni-segmented-control>
					</view>
					<view class="position">
						<!-- icon -->
						<uni-icons type="location-filled" class="posion-icon"></uni-icons>
						<!-- 地点 -->
						{{position}}
					</view>
				</view>
				<view class="filterData">
					<uni-segmented-control :current="current" :values="items" class="filterDataItem"
						@clickItem="onClickItem" styleType="button" activeColor="#4cd964"></uni-segmented-control>
				</view>
				<view class="content" v-if="filterList">
					<view class="course-all" v-show="current === 0">
						<view class="course-item" v-for="(item,index) in filterList" :key="item.cardItemId">
							<cardItem :course="item" />
						</view>
					</view>
					<view class="course-all" v-show="current === 1">
						<view class="course-item" v-for="(item,index) in filterList" :key="item.cardItemId">
							<cardItem :course="item" />
						</view>
					</view>
					<view class="course-all" v-show="current === 2">
						<view class="course-item" v-for="(item,index) in filterList" :key="item.cardItemId">
							<cardItem :course="item" />
						</view>
					</view>
				</view>
				<view class=" content-empty" v-else>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CardItem from '@/components/cartItem/cartItem.vue'
	import {
		getFilterData
	} from '@/api/index.js'

	export default {
		components: {
			CardItem,
		},
		data() {
			return {
				title: 'hello',
				tabs: ['社区拼班', '其他拼班动态'],
				positionCurrent: 0,
				items: ['全部', '进行中', '已结束'],
				current: 0,
				banner: [],
				position: '',
				courseList: [],
				filterList: [],
			}
		},
		onReady() {
			this.getContentList()

		},
		onLoad() {
			uni.showLoading({
				title: '加载中...'
			});

			uni.request({
				url: 'http://192.168.149.38:3000/api/pay',
				method: 'POST',
				header: {
					'Content-Type': 'application/json'
				},
				data: {
					orderId: 'o1002', // 替换为真实订单 ID
					payPassword: '123456' // 替换为实际支付密码
				},
				success: (res) => {
					if (res.data.status === 200 && res.data.data.isTrade) {
						console.log(res)
						uni.showToast({
							title: '支付成功',
							icon: 'success'
						});
					} else {
						console.log(res)
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						});
					}
					console.log('支付返回结果：', res.data);
				},
				fail: (err) => {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
					console.error('支付请求失败：', err);
				}
			});




		},
		methods: {
			async onClickItem(e) {
				uni.request({
					url: 'http://192.168.137.1:3000/api/admin/logout', // 示例：退出登录
					method: 'POST',
					header: {
						Authorization: 'Bearer ' +
							'pH_Mdx12QPkRXgrDvuqhPj5QcwZVUC3pylyCPE' // 在 header 中加 token
					},
					success: (res) => {
						if (res.data.status === 200) {
							uni.removeStorageSync('adminToken'); // 清除 token
							uni.showToast({
								title: '退出成功'
							});
						} else {
							uni.showToast({
								title: res.data.desc,
								icon: 'none'
							});
						}
					}
				});


				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
					const filterData = await getFilterData(this.current, this.positionCurrent)
					const {
						data
					} = filterData
					const {
						filterItems
					} = data
					console.log(data);
					this.filterList = filterItems
				}
			},
			async handleToggle(e) {
				if (this.positionCurrent != e.currentIndex) {
					this.positionCurrent = e.currentIndex;
					const filterData = await getFilterData(this.current, this.positionCurrent)
					const {
						data
					} = filterData
					console.log(filterData);
					const {
						filterItems
					} = data
					this.filterList = filterItems
					console.log(this.filterList)
				}
			},
			async getContentList() {
				try {
					const filterRes = await getFilterData(this.current, this.positionCurrent)
					console.log(filterRes);

				} catch (err) {
					this.banner = [
						'/static/resource/images/banner/banner1.jpg',
						'/static/resource/images/banner/banner1.jpg',
						'/static/resource/images/banner/banner1.jpg',
						'/static/resource/images/banner/banner1.jpg'
					]
				}
			},

		}
	}
</script>

<style>
	@import "@/pages/index/index.css"
</style>