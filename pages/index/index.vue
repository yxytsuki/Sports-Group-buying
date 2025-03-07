<template>
	<view class="content">
		<view class="banner">
			<swiper :indicator-dots="true" :circular="true" :autoplay="true" :interval="3000" :duration="1000">
				<!-- 根据imgList渲染 -->
				<swiper-item v-for="(item,index) in bannerList" :key="index">
					<image class="banner-img" :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="body">
			<view class="tab">
				<view class="position-filterTabs">
					<view class="filterTabs">
						<uni-segmented-control :current="positionCurrent" :values="tabs" style-type="text"
							activeColor="#4cd964"></uni-segmented-control>
					</view>
					<view class="position">
						<!-- icon -->
						<uni-icons type="location-filled" class="posion-icon"></uni-icons>
						<!-- 地点 -->
						浙江理工大学
					</view>
				</view>
				<view class="filterData">
					<uni-segmented-control :current="current" :values="items" class="filterDataItem"
						@clickItem="onClickItem" styleType="button" activeColor="#4cd964"></uni-segmented-control>
				</view>
				<view class="content">
					<view class="course-all" v-show="current === 0">
						<ul>
							<li v-for="(item,index) in courseList" :key="index">
								<cardItem />
							</li>
						</ul>
					</view>
					<view v-show="current === 1">
						选项卡2的内容
					</view>
					<view v-show="current === 2">
						选项卡3的内容
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import segmented from '@/uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.vue'
	import CardItem from '@/components/cartItem/cartItem.vue'

	export default {
		components: {
			CardItem,
		},
		data() {
			return {
				title: 'hello',
				bannerList: [
					'/static/resource/images/banner/banner1.jpg',
					'/static/resource/images/banner/banner2.jpg',
					'/static/resource/images/banner/banner1.jpg',
					'/static/resource/images/banner/banner2.jpg'
				],
				tabs: ['小区拼班', '部分拼班动态'],
				positionCurrent: 0,

				items: ['全部', '进行中', '已结束'],
				current: 0,
				courseList: [1, 2, 3, 4, 5]


			}
		},
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			}
		}
	}
</script>

<style>
	@import "@/pages/index/index.css"
</style>