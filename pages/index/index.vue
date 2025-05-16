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
				<view class=" content-empty" v-if="filterList.length===0">
					<image src="/static/resource/images/empty.jpg"></image>
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
				filterList: [],
			}
		},
		onReady() {
			this.getContentList()

		},
		methods: {
			async onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
					const filterData = await getFilterData(this.positionCurrent, this.current)
					console.log('筛选')
					console.log(filterData)
					this.filterList = [...filterData.filterItems]
				}
			},
			async handleToggle(e) {
				console.log(12)
				if (this.positionCurrent != e.currentIndex) {
					this.positionCurrent = e.currentIndex;
					const filterData = await getFilterData(this.positionCurrent, this.current)
					console.log(filterData)
					this.filterList = [...filterData.filterItems]
				}
			},
			async getContentList() {
				const filterRes = await getFilterData(this.current, this.positionCurrent)
				this.banner = filterRes.bannerList
				this.filterList = [...filterRes.filterItems]
				this.position = filterRes.position

			},

		}
	}
</script>

<style>
	@import "@/pages/index/index.css"
</style>