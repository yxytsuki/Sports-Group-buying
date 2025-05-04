import request from '@/utils/request'
import axios from 'axios'

// 查询用户信息
export const postNewClass = () => {
	return request.post('http://127.0.0.1:4523/m1/6035558-5725382-default/getOrderDetail')
}