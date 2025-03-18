import request from '@/utils/request'
import axios from 'axios'

export const getOrderList = () => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getOrderList')
}

// 获取筛选订单数据
export const getFilterOrder = (current) => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getFilterOrder', {
		params: {
			current
		}
	})
}