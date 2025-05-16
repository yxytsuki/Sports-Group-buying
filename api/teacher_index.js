import request from '@/utils/request'

// 获取教师收入
export const getTeacherIncome = (param) => {
	console.log('参数', param);
	return request.get('/api/teacherIncome', {
		params: param
	});
}