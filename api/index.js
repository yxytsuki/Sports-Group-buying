// 用于存放登录所有相关的接口
import request from '@/utils/request'

// export const getContentList = () => {
// 	return request.get('/api/index_list/filterdata?current=0&positionCurrent=1')
// }
// 获取筛选数据
export const getFilterData = (current, positionCurrent) => {
	console.log(current, positionCurrent)
	return request.get('/api/index_list/filterdata', {
		params: {
			current,
			positionCurrent
		}
	})
}