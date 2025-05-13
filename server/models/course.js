class Course {
	constructor(data) {
		this.courseId = data.courseId;
		this.title = data.title;
		this.backgroundImage = data.backgroundImage;
		this.address = data.address;
		this.adressDetail = data.adressDetail;
		this.classNumber = data.classNumber;
		this.currentNumber = data.currentNumber || 0;
		this.totalNumber = data.totalNumber;
		this.isRunning = data.isRunning;
		this.distance = data.distance ? parseFloat(data.distance).toFixed(1) : null;

		this.teacherName = data.teacherName;
		this.coursePrice = data.coursePrice?.toString(); // 保证是字符串
		this.courseDesc = data.courseDesc;
		this.courseMsg = data.courseMsg;
		this.iscollected = data.iscollected || false;

		this.time = {
			startTime: data.time?.startTime,
			endTime: data.time?.endTime,
			weekday: data.time?.weekday || [],
			day: data.time?.day, // 如果有传
			during: data.time?.during // 如果有传
		};

		this.students = (data.students || []).map(s => ({
			studentId: s.studentId,
			studentName: s.studentName,
			avator: s.avator
		}));
	}
}

module.exports = Course;