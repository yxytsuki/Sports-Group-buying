<template>
	<view>
		<view class="myClass-item">
			<view class="myClass-title">
				<view class="myClass-title-class">班级</view>
				<span class="myClass-title-txt">篮球启蒙班</span>
			</view>
			<view class="myClass-content">
				<view class="myClass-content-msg">
					<view class="myClass-msg-time">
						总周期16周 当前第5周
					</view>
					<button class="myClass-msg-detail">查看详情</button>
				</view>
				<view class="myClass-content-avatar">
					<ul v-if="avatarList.length<=3">
						<li v-for="(item,index) in avatarList" :key="index" :style="{left:`${25+index * overlap}px`}">
							<image :src="item"></image>
						</li>
					</ul>
					<span class="myClass-avatarTxt">{{`剩余${avatarList.length}个名额`}}</span>
				</view>

				<view class="myClass-content-detail">
					<uni-icons type="map-pin-ellipse" class="myClass-detail-icon"></uni-icons>
					<span class="myClass-detail-txt">下沙高教公园</span>
				</view>
				<view class="myClass-content-detail">
					<uni-icons type="map-pin-ellipse" class="myClass-detail-icon"></uni-icons>
					<span class="myClass-detail-txt">下沙高教公园</span>
				</view>
				<view class="myClass-content-detail">
					<uni-icons type="map-pin-ellipse" class="myClass-detail-icon"></uni-icons>
					<span class="myClass-detail-txt">下沙高教公园</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "classListItem",
		data() {
			return {
				overlap: 20,
				avatarList: [
					'/static/logo.png',
					'/static/logo.png',
					'/static/logo.png'
				]
			};
		}
	}
</script>

<style>
	@import url(./classListItem.css);
</style>