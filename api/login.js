import request from '@/utils/request'
import axios from 'axios'

export const getLoginCode = () => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getLoginCode')
}
export const getLogin = (param) => {
	return request.post('http://127.0.0.1:4523/m1/6035558-5725382-default/getLogin', {
		...param
	})
}
export const getUser = (userId) => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getUser', {
		params: {
			userId
		}
	})
}