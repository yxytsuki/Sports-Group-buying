<template>
	<view class="details-content">
		<view class="details-content-img">
			<image src="/static/resource/images/banner/banner1.jpg"></image>
		</view>
		<view class="details-content-top">
			<view class="details-content-title">
				19.9体验课
			</view>
			<view class="details-content-teacher">
				上课老师：陶老师
			</view>
			<view class="details-content-time">
				<swiper class="details-time-swiper" :interval="3000" :duration="1000">
					<swiper-item>
						<uni-grid :column="4" :highlight="true">
							<uni-grid-item v-for="item in 4" :index="item" :key="item">
								<view class="grid-item-box">
									<view class="details-time-week">
										{{`第${item}周`}}
									</view>
									<text class="details-time-txt">进行中</text>
								</view>
							</uni-grid-item>
						</uni-grid>

					</swiper-item>
					<swiper-item>
						<uni-grid :column="4" :showBorder="false" :square="false">
							<uni-grid-item v-for="item in 4" :index="item" :key="item">
								<view class="grid-item-box">
									<view class="details-time-week">
										{{`第${item}周`}}
									</view>
									<text class="details-time-txt">进行中</text>
								</view>
							</uni-grid-item>
						</uni-grid>

					</swiper-item>
				</swiper>
			</view>
			<view class="details-content-direction">
				<view>
					<view class="details-direction-txt" v-for="item in 6" :key="item">
						<uni-icons type="map-pin-ellipse" class="detail-direction-icon"></uni-icons>
						<span class="detail-direction-txt">下沙高教公园</span>
					</view>
				</view>
				<view class="details-direction-action">
					<uni-icons type="paperplane" class="details-action-icon" size="36"></uni-icons>
					<view class="details-action-txt">
						导航
					</view>
				</view>
			</view>
		</view>
		<view class="details-content-bottom">
			<view class="details-content-amount">
				课程单价
				<span class="details-amount-amount">￥80/节</span>
			</view>
			<view class="details-content-member">
				<view class="details-member-header">
					<view class="details-member-member">
						8人班
					</view>
					<span class="details-member-status">进行中</span>
				</view>
				<view class="details-member-avator">
					<view class="details-member-txt">
						满5人成班，剩余<span class="details-member-rest">1</span>个名额
					</view>
					<view class="details-avator-father">
						<view class="details-avator-avator" v-for="item in 7" :key="item">
							<image src="/static/logo.png" class="details-avator-img"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="details-content-footer">
			<!-- 拼班说明 -->
			<view class="details-content-describe">
				<view class="details-describe-header">
					<view class="details-header-title">
						拼班说明
					</view>
				</view>
				<view class="details-describe-txt">
					<view class="details-txt-title">
						拼班说明:
					</view>
					<view class="details-txt-body">
						<p class="details-txt-txt" v-for="item in 4">{{`${item}、支付成功即为拼班成功`}}</p>
					</view>
				</view>
			</view>
			<!-- 课程简介 -->
			<view class="details-content-describe">
				<view class="details-describe-header">
					<view class="details-header-title">
						拼班说明
					</view>
				</view>
				<view class="details-describe-txt">
					<view class="details-txt-title">
						拼班说明:
					</view>
					<view class="details-txt-body">
						<p class="details-txt-txt" v-for="item in 4">{{`${item}、支付成功即为拼班成功`}}</p>
					</view>
				</view>
			</view>
		</view>
		<view class="details-content-join">
			<view class="details-join-share">
				<uni-icons type="undo" class="details-join-icon" size="30"></uni-icons>
				<view details-join-collectclass="details-join-txt">
					分享
				</view>
			</view>
			<view class="details-join-collect">
				<uni-icons type="star" class="details-join-icon" size="30"></uni-icons>
				<view class="details-join-txt">
					收藏
				</view>
			</view>
			<view class="details-join-btn">
				加入拼班
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	@import url(./details.css);
</style>