<template>
	<view class="content">
		<view class="banner">
			
		</view>
		<view class="body">
			<view class="tab">
				<ant-tabs items="小区拼班" />
				<ant-tabs items="部分拼班状态" />
				
			</view>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'hello',
			}
		},
		methods: {
			handleTap(){
				console.log('点击了')
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.banner {
		width: 100%;
		height: 50vw;
		background-color: pink;
	}
</style>
