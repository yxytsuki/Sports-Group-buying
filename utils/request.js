import {
	useUserStore
} from "../store/user";

function createRequest(config = {}) {
	const defaultConfig = {
		baseUrl: 'http://192.168.43.38:3000',
		header: {
			'content-type': 'application/json'
		},
		dataType: 'json',
		token: true
	};
	// 请求拦截器：加上 token
	function requestInterceptor(options) {
		const token = useUserStore().userInfo.token || '';
		if (options.token && token) {
			options.header = {
				...options.header,
				Authorization: `Bearer ${token}`
			};
		}
		return options;
	}

	// 响应拦截器：处理状态码
	function responseInterceptor(response) {
		if (response.statusCode !== 200) {
			uni.showToast({
				title: response.data.desc || `网络错误(${response.statusCode})`,
				icon: 'none'
			});
			return Promise.reject(response);
		}

		const resData = response.data;

		if (resData.status !== 200) {
			uni.showToast({
				title: resData.desc || '请求失败',
				icon: 'none'
			});
			return Promise.reject(resData);
		}

		return resData.data;
	}

	// 通用请求函数
	function baseRequest(method, url, data = {}, options = {}) {
		// 处理 GET 参数拼接
		if (method === 'GET' && options.params) {
			const queryString = Object.keys(options.params)
				.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options.params[key])}`)
				.join('&');
			if (queryString) {
				url += (url.includes('?') ? '&' : '?') + queryString;
			}
		}

		const finalOptions = {
			...defaultConfig,
			...config,
			...options,
			url: (config.baseUrl || defaultConfig.baseUrl) + url,
			data,
			method,
			header: {
				...defaultConfig.header,
				...(config.header || {}),
				...(options.header || {})
			},
			token: options.token !== undefined ? options.token : defaultConfig.token
		};

		const interceptedOptions = requestInterceptor(finalOptions);

		return new Promise((resolve, reject) => {
			uni.showLoading({
				title: '加载中',
				mask: true
			});

			uni.request({
				...interceptedOptions,
				success: (result) => {
					uni.hideLoading();
					try {
						const data = responseInterceptor(result);
						resolve(data);
					} catch (err) {
						reject(err);
						uni.showToast({
							title: err.desc || '出错啦',
							icon: "fail",

						})
					}
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({
						title: '网络开小差啦~',
						icon: 'error'
					});
					reject(err);
				}
			});
		});
	}

	// 暴露统一接口
	return {
		get: (url, options = {}) => baseRequest('GET', url, {}, options),
		post: (url, data = {}, options = {}) => baseRequest('POST', url, data, options),
		put: (url, data = {}, options = {}) => baseRequest('PUT', url, data, options),
		delete: (url, data = {}, options = {}) => baseRequest('DELETE', url, data, options)
	};
}

const request = createRequest();
export default request;