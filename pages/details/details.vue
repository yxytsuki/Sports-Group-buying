<template>
	<view class="details-content">
		<view class="details-content-img">
			<image :src="courseDetail.backgroundImage"></image>
		</view>
		<view class="details-content-top">
			<view class="details-content-title">
				{{courseDetail.title}}
			</view>
			<view class="details-content-teacher">
				{{`上课老师：${courseDetail.teacherName}`}}
			</view>
			<view class="details-content-time">
				<swiper class="details-time-swiper" :interval="3000" :duration="1000">
					<swiper-item v-for="week in 2" :key="week">
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

				</swiper>
			</view>
			<view class="details-content-direction">
				<view>
					<view class="details-direction-txt">
						<uni-icons type="map-pin-ellipse" class="detail-direction-icon"></uni-icons>
						<span class="detail-direction-txt">{{`上课时间： 10:00~12:00`}}</span>
					</view>
					<view class="details-direction-txt">
						<uni-icons type="map-pin-ellipse" class="detail-direction-icon"></uni-icons>
						<span class="detail-direction-txt">{{`上课社区： ${courseDetail.address}`}}</span>
					</view>
					<view class="details-direction-txt">
						<uni-icons type="map-pin-ellipse" class="detail-direction-icon"></uni-icons>
						<span class="detail-direction-txt">{{`上课地点： ${courseDetail.adressDetail}`}}</span>
					</view>
				</view>
				<view class="details-direction-action">
					<uni-icons type="paperplane" class="details-action-icon" size="36" @click="handleJump"></uni-icons>
					<view class="details-action-txt">
						导航
					</view>
				</view>
			</view>
		</view>
		<view class="details-content-bottom">
			<view class="details-content-amount">
				课程单价
				<span class="details-amount-amount">{{`￥${courseDetail.coursePrice}/节`}}</span>
			</view>
			<view class="details-content-member">
				<view class="details-member-header">
					<view class="details-member-member">
						{{`${courseDetail.totalNumber}人班`}}
					</view>
					<span class="details-member-status">进行中</span>
				</view>
				<view class="details-member-avator">
					<view class="details-member-txt">
						{{`满${courseDetail.totalNumber}人成班，剩余`}}
						<span class="details-member-rest">{{courseDetail.totalNumber - studentsNumber}}</span>个名额
					</view>
					<view class="details-avator-father">
						<view class="details-avator-avator" v-for="(item,index) in courseDetail.students"
							:key="item.studentId">
							<image :src="item.avator" class="details-avator-img"></image>
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
						<p v-html="courseDetail.courseDesc" class="details-txt-txt"></p>
					</view>
				</view>
			</view>
			<!-- 课程简介 -->
			<view class="details-content-describe">
				<view class="details-describe-header">
					<view class="details-header-title">
						课程简介
					</view>
				</view>
				<view class="details-describe-txt">
					<view class="details-txt-title">
						课程简介:
					</view>
					<view class="details-txt-body">
						<p v-html="courseDetail.courseMsg" class="details-txt-txt"></p>
					</view>
				</view>
			</view>
		</view>
		<view class="details-content-join">
			<view class="details-join-share">
				<uni-icons type="undo" class="details-join-icon" size="30" @click="handleShare"></uni-icons>
				<view details-join-collectclass="details-join-txt">
					分享
				</view>
			</view>
			<view class="details-join-collect">
				<uni-icons type="star" class="details-join-icon" size="30" v-if="!courseDetail.iscollected"
					@click="handleCollected"></uni-icons>
				<uni-icons type="star-filled" class="details-join-icon" size="30" color="#ff7357" v-else
					@click="handleCollected"></uni-icons>
				<view class="details-join-txt">
					收藏
				</view>
			</view>
			<view class="details-join-btn" @click="goPay(courseId)">
				加入拼班
			</view>
			<uni-popup ref="share" type="share" safeArea backgroundColor="#fff">
				<uni-popup-share></uni-popup-share>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		getCourseDetail,
		collected
	} from '@/api/details.js'
	import {
		useUserStore
	} from '../../store/user';

	import {
		useAuth
	} from '@/utils/getUserInfo.js'
	export default {
		onLoad(options) {
			this.getContentList(options.id)
			this.courseId = options.id
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
				courseDetail: {},
				studentsNumber: 0,
				startTime: '',
				endTime: '',
				courseId: '',
				weekNumber: 0,
				timer: null,
				user_id: useUserStore().userInfo.user_id
			}
		},
		onUnload() {
			clearTimeout(this.timer)
		},
		computed: {
			// 计算属性的getter
			getWeeks() {
				const start = new Date(this.startTime)
				const end = new Date(this.endTime)
				const diffTime = Math.abs(end - start)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
				const weeks = Math.ceil(diffDays / 7)
				return weeks
			}
		},
		methods: {
			async getContentList(courseId) {
				const data = await getCourseDetail({
					courseId: courseId,
					userId: this.user_id
				})

				this.courseDetail = data
				console.log(this.courseDetail);
				this.studentsNumber = data?.students.length
				this.startTime = data?.time?.startTime
				this.endTime = data?.time?.endTime
				// 一周几节课
				this.weekNumber = data?.time?.day.length
			},
			async handleCollected() {
				/* 
					判断是否收藏，调用接口，传入id和当前收藏状态
				*/
				const res = await collected({
					userId: this.user_id,
					courseId: this.courseId,
				})
				console.log(res)
				if (res?.isCollected) {
					uni.showToast({
						title: '收藏成功',
						icon: 'success',
						mask: true,
						duration: 500
					})
				} else {
					uni.showToast({
						title: '收藏失败',
						icon: "error",
						mask: true,
						duration: 500
					})
				}
				this.courseDetail.iscollected = res?.isCollected
			},
			handleJump() {
				// 跳转百度地图 需要当前经度纬度 后续接口完善再做设计
				// uni.navigateTo({
				// 	url: ''
				// })
			},
			goPay(id) {
				uni.showToast({
					title: "跳转中...",
					icon: "loading",
					mask: true,
					duration: 500
				})
				this.timer = setTimeout(() => {
					uni.navigateTo({
						url: `/pages/pay/pay?courseId=${id}`
					})
				}, 500)
			},
			handleShare() {
				this.shareToggle()
			},
			shareToggle() {
				this.$refs.share.open()
			}
		}
	}
</script>

<style>
	@import url(./details.css);
</style>