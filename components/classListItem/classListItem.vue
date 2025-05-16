<template>
	<view>
		<view class="myClass-item">
			<view class="myClass-title">
				<view class="myClass-title-class">班级</view>
				<span class="myClass-title-txt">{{classListItem?.title}}</span>
			</view>
			<view class="myClass-content">
				<view class="myClass-content-msg">
					<view class="myClass-msg-time">
						{{`总周期${getWeeks}周 当前第${getWeekNumber(startTime,endTime,now)}周`}}
					</view>
					<button class="myClass-msg-detail">查看详情</button>
				</view>
				<view class="myClass-content-avatar">
					<view class="myClass-avator-list" v-if="students.length<=3">
						<view class="myClass-avator-item" v-for="(item,index) in students" :key="index"
							:style="{left:`${25+index * overlap}px`}">
							<image :src="item?.avatar"></image>
						</view>
					</view class="myClass-avator-ul">
					<span class="myClass-avatarTxt">{{`剩余个名额${subNumber}`}}</span>
				</view>

				<view class="myClass-content-detail">
					<uni-icons type="map-pin-ellipse" class="myClass-detail-icon"></uni-icons>
					<span class="myClass-detail-txt">{{classListItem?.class_number}}</span>
				</view>
				<view class="myClass-content-detail">
					<uni-icons type="map-pin-ellipse" class="myClass-detail-icon"></uni-icons>
					<span class="myClass-detail-txt">{{classListItem?.address}}</span>
				</view>
				<view class="myClass-content-detail">
					<uni-icons type="map-pin-ellipse" class="myClass-detail-icon"></uni-icons>
					<span class="myClass-detail-txt">{{formatTimestamp(startTime)}}~{{formatTimestamp(endTime)}}</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "classListItem",
		props: {
			classListItem: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},

		data() {
			return {
				overlap: 20,
				students: this.classListItem?.students,
				startTime: this.classListItem?.start_time,
				endTime: this.classListItem?.end_time,
				now: Date.now()

			};
		},
		methods: {
			// 将毫秒时间戳转化为日期格式
			formatTimestamp(timestamp) {
				const date = new Date(timestamp);
				const Y = date.getFullYear();
				const M = String(date.getMonth() + 1).padStart(2, '0');
				const D = String(date.getDate()).padStart(2, '0');
				const h = String(date.getHours()).padStart(2, '0');
				const m = String(date.getMinutes()).padStart(2, '0');
				const s = String(date.getSeconds()).padStart(2, '0');

				return `${Y}-${M}-${D}`;
			},
			getWeekNumber(startTime, endTime, now) {
				const weekMillis = 7 * 24 * 60 * 60 * 1000;
				if (now < startTime || now > endTime) {
					return this.getWeeks;
				}
				const diff = now - startTime;
				const weekIndex = Math.floor(diff / weekMillis) + 1;

				return weekIndex;
			},

		},
		computed: {
			subNumber() {
				return this.classListItem?.total_number - this.students.length
			},
			getWeeks() {
				const diffTime = Math.abs(this.endTime - this.startTime)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
				const weeks = Math.ceil(diffDays / 7)
				return weeks
			},

		},
		onLoad() {
			console.log('学生', this.classListItem)
		},
	}
</script>

<style>
	@import url(./classListItem.css);
</style>