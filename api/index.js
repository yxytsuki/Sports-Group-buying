// 用于存放登录所有相关的接口
import request from '@/utils/request'
import axios from 'axios'
// 获取首页数据
export const getContentList = () => {
	return request.get('https://m1.apifoxmock.com/m1/6035558-5725382-default/getContentList')
}
// 获取筛选数据
export const getFilterData = (current, positionCurrent) => {
	return request.post('https://m1.apifoxmock.com/m1/6035558-5725382-default/getFilterData', {
		current,
		positionCurrent
	})
}