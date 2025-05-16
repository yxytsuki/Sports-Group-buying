import request from '@/utils/request'
import axios from 'axios'



// 获取筛选订单数据
export const getFilterOrder = (param) => {
	return request.get('/api/getFilterOrder', {
		params: {
			...param
		}
	})
}