import request from "../utils/request";
export const adminLogin = (param) => {
	return request.post('/api/admin/login', {
		...param
	})
}

// 管理员——添加/修改/编辑
export const adminStudent = (param) => {
	return request.post('/api/admin/addStudent', {
		...param
	})
}

// 管理员——删除学员
export const admindelStudent = (param) => {
	return request.post('/api/admin/deleteStudent', {
		...param
	})
}

// 管理员——模糊查询学生列表
export const adminGetStudent = (param) => {
	return request.get('/api/admin/getStudents', {
		params: param
	})
}

// 管理员查询某个学生详情
export const adminGetStudentDetail = (param) => {
	return request.get('/api/admin/getStudentDetail', {
		params: param
	})
}

// 管理员-添加/编辑/修改学生
export const adminAddStudent = (param) => {
	return request.post('/api/admin/addStudent', {
		...param
	})
}