import request from '@/utils/request'
import axios from 'axios'

// 获取支付订单详情
export const getOrderDetail = (param) => {
	return request.get('/api/createOrder', {
		params: {
			...param
		}
	})
}
// 查看协议
export const getLinkContent = () => {
	return request.get('/api/getLinkContent')
}
// 支付密码校验
export const checkPay = (param) => {
	return request.post('/api/pay', {
		...param
	})
}