// 用于存放登录所有相关的接口
import request from '@/utils/request'
import axios from 'axios'
export const getPicCode = () => {
	return request.post('/captcha/image')
}