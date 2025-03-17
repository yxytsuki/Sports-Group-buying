// 用于存放详情所有相关的接口
import request from '@/utils/request'
import axios from 'axios'
// 获取详情页数据
export const getCourseDetail = (id) => {
	return request.post(`http://127.0.0.1:4523/m1/6035558-5725382-default/getCourseDetail?courseId=${id}`)
}
// 收藏接口
export const collected = (id, iscollected) => {
	return request.get(
		`http://127.0.0.1:4523/m1/6035558-5725382-default/collected?id=${id}&isCollected=${iscollected}`)
}