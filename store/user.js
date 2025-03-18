import {
	defineStore
} from 'pinia'
import {
	ref,
	computed
}
from 'vue'
export const useUserStore = defineStore('user', () => {
	// 初始化token
	const token = ref(localStorage.getItem('token') || '')
	// 初始化用户信息
	const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) || {
		avator: 'https://image.baidu.com/search/detail?ct=503316480&z=0&tn=baiduimagedetail&ipn=d&cl=2&cm=1&sc=0&lm=-1&ie=gb18030&pn=0&rn=1&di=7477984738934784001&ln=0&word=%BB%D2%C9%AB%C4%AC%C8%CF%CD%B7%CF%F1%CD%BC%C6%AC&os=1142764407,762634299&cs=2190806929,209502856&objurl=http%3A%2F%2Fimg1.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp515017570.jpg&bdtype=0&simid=2190806929,209502856&pi=0&adpicid=0&timingneed=&spn=0&is=1142764407,762634299',
		nickName: "未登录",
		userId: '2025'
	})
	const setUserInfo = (newUserInfo) => {
		userInfo.value = {
			...userInfo.value,
			...newUserInfo
		}
	}
	return {
		token,
		userInfo,
		setUserInfo
	}
})