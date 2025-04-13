import request from '@/utils/request'
import axios from 'axios'

// 获取支付订单详情
export const getTeacherIndex = () => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getTeacherIndex')
}
// export const getTeacherIndex = (param) => {
// 	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getOrderDetail', {
// 		params: {
// 			...param
// 		}
// 	})
// }