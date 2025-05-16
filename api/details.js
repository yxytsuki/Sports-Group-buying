// 用于存放详情所有相关的接口
import request from '@/utils/request'
// 获取详情页数据
export const getCourseDetail = (params) => {
	console.log(params)
	return request.get('/api/courseDetail', {
		params: {
			...params
		}
	})
}

// 收藏接口
export const collected = (params) => {
	console.log(params)
	return request.post('/api/detail_collected', {
		...params
	})
}