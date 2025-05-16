import request from '@/utils/request'
import axios from 'axios'

export const getLoginCode = (phone) => {
	return request.post('/api/getCode', {
		phone
	});
};

export const getLogin = (param) => {
	console.log('参数')
	console.log(param)
	return request.post('/api/login', {
		...param
	})
}
export const getUser = (userId) => {
	return request.get('/api/getUser', {
		params: {
			userId
		}
	})
}
export const getlogout = () => {
	return request.post('/api/logout')
}