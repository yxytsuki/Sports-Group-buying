import request from '@/utils/request'
import axios from 'axios'

// 获取支付订单详情
export const getOrderDetail = (param) => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getOrderDetail', {
		params: {
			...param
		}
	})
}
// 查看协议
export const getLinkContent = () => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getLinkContent')
}
// 支付密码校验
export const checkPay = (coursePrice, password, userId) => {
	return request.get(
		`http://127.0.0.1:4523/m1/6035558-5725382-default/checkPay?coursePrice=${coursePrice}&password=${password}&userId=${userId}`
	)
}