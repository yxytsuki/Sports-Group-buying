import request from "../utils/request";

export const addStudent = (param) => {
	console.log('参数')
	console.log(param)
	return request.post('/api/admin/addStudent', {
		...param
	})
}

export const getStudentList = (params) => {
	return request.get('/api/teacherStudents', {
		params: {
			...params
		}
	});
};

export const teacherStudentDetail = (param) => {
	return request.get('/api/teacher/studentDetail', {
		params: {
			...param
		}
	})
}

export const teacherStudent = (param) => {
	return request.post('/api/delCourse_student', {
		...param
	})
}