import request from '@/utils/request'
import axios from 'axios'

// 查询用户信息
export const getUserMsg = (userId) => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getOrderDetail', {
		params: {
			userId
		}
	})
}