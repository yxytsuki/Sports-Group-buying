import request from "../utils/request";
export const createCourse = (param) => {
	console.log(param)
	return request.post('/api/createCourse', {
		...param
	})
}
export const insertWeek = (param) => {
	console.log('参数')
	console.log(param)
	return request.post('/api/courseWeek', {
		...param
	})
}
export const getTeacherIncome = (param) => {
	return request.get('/api/teacherIncomeDetail', {
		params: param
	});
}
export const getMyClass = (param) => {
	console.log('参数', param)
	return request.get('/api/myClass', {
		params: param
	})
}
export const adminGetTeacherList = (param) => {
	return request.post('/api/admin/adminSearchTeachers', {
		...param
	})
}