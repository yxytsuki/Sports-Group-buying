function createRequest(config = {}) {
	const defaultConfig = {
		baseUrl: 'http://localhost:3000',
		header: {
			'content-type': 'application/json'
		},
		dataType: 'json',
		token: true
	};

	function requestInterceptor(options) {
		const token = uni.getStorageSync('token');
		if (options.token && token) {
			options.header = {
				...options.header,
				Authorization: `Bearer ${token}`
			};
		}
		return options;
	}

	function responseInterceptor(response) {
		if (response.statusCode !== 200) {
			uni.showToast({
				title: `网络错误(${response.statusCode})`,
				icon: 'none'
			});
			return Promise.reject(response);
		}

		const resData = response.data;
		if (resData.status !== 0) {
			uni.showToast({
				title: resData.desc || '请求失败',
				icon: 'none'
			});
			return Promise.reject(resData);
		}

		return resData.data;
	}

	// 通用 request 函数
	function baseRequest(method, url, data = {}, options = {}) {
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
					responseInterceptor(result)
						.then(resolve)
						.catch(reject);
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

	// 返回类似 axios 的形式
	return {
		get: (url, options = {}) => baseRequest('GET', url, {}, options),
		post: (url, data = {}, options = {}) => baseRequest('POST', url, data, options),
		put: (url, data = {}, options = {}) => baseRequest('PUT', url, data, options),
		delete: (url, data = {}, options = {}) => baseRequest('DELETE', url, data, options)
	};
}

const request = createRequest();
export default request;