// 判断是否已登录
import {
	useUserStore
} from '../store/user.js';
export function useAuth() {
	const userStore = useUserStore()

	// 判断是否登录
	const isLogin = () => {
		const token = userStore.userInfo?.token
		if (!token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateTo({
					url: "/pages/getUserInfo/getUserInfo"
				})
			}, 800)
			return false
		}
		return true
	}

	return {
		isLogin
	}
}