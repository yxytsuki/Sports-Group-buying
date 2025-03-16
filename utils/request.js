import axios from "axios";
// 创建axios实例，将对创建出来的实例进行自定义配置
// 不会污染原始axios

const instance = axios.create({
	// 后续会根据服务端基地址进行更改
	baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
	timeout: 5000
})

// 自定义配置,配置请求响应拦截器
// 添加请求拦截器
instance.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	// 开启loading，禁止背景点击，也相当于一个节流效果
	// 自定义加载图标
	uni.showToast({
		title: "加载中...",
		icon: "loading",
		mask: true,
		duration: 10000
	})

	// 只要有token，就在请求时携带，便于请求需要授权的接口
	// const token = store.getters.token
	const token = ''
	if (token) {
		config.headers['Access-Token'] = token
		config.headers.platform = 'mp-weixin'
	}

	return config
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
	// 2xx 范围内的状态码都会触发该函数。
	// 对响应数据做点什么

	const res = response.data
	if (res.status !== 200) {
		uni.showToast({
			title: "服务器开小差啦~",
			icon: "error",
			duration: 2000
		})
		// 抛出错误提示
		return Promise.reject('服务器开小差啦~')
	} else {
		uni.hideToast()
	}
	return res
}, function(error) {
	// 超出 2xx 范围的状态码都会触发该函数。
	// 对响应错误做点什么

	return Promise.reject(error)
})

export default instance