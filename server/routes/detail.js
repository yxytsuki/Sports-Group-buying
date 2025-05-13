var express = require('express');
var router = express.Router();
const pool = require('../db/sql.js');
const Course = require('../models/Course'); // 引入课程类

// GET /api/courseDetail?courseId=1000&userId=xxx
router.get('/api/courseDetail', async function(req, res) {
	const {
		courseId,
		userId
	} = req.query;

	if (!courseId || !userId) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 courseId 或 userId 参数'
		});
	}

	try {
		// 查询课程
		const [courseRows] = await pool.query(`
      SELECT * FROM courses WHERE course_id = ?
    `, [courseId]);

		if (courseRows.length === 0) {
			return res.status(404).json({
				status: 404,
				desc: '课程不存在'
			});
		}

		const course = courseRows[0];

		// 查询是否收藏
		const [collectRows] = await pool.query(`
      SELECT 1 FROM collections WHERE user_id = ? AND course_id = ?
    `, [userId, courseId]);

		const isCollected = collectRows.length > 0;

		// 查询学生列表
		const [students] = await pool.query(`
      SELECT student_id, student_name, avatar FROM course_students WHERE course_id = ?
    `, [courseId]);

		// 组装课程数据
		const courseData = new Course({
			cardItemId: course.course_id,
			title: course.title,
			backgroundImage: course.background_image,
			address: course.address,
			classNumber: course.class_number,
			currentNumber: students.length,
			totalNumber: course.total_number,
			isRunning: course.is_running,
			distance: course.distance,
			teacherName: course.teacher_name,
			coursePrice: course.course_price,
			adressDetail: course.address_detail,
			courseDesc: course.course_desc,
			courseMsg: course.course_msg,
			time: {
				startTime: formatFullTime(course.start_time),
				endTime: formatFullTime(course.end_time),
				day: course.week_day,
				during: `${formatDate(course.start_time)}~${formatDate(course.end_time)}`
			}
		});

		// 附加收藏状态和学生信息
		courseData.iscollected = isCollected;
		courseData.students = students.map(s => ({
			studentName: s.student_name,
			avator: s.avatar,
			studentId: s.student_id
		}));

		res.json({
			status: 200,
			data: courseData,
			desc: '请求成功'
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});

// 时间格式化：2025/05/13 14:30
function formatFullTime(ts) {
	if (!ts) return '';
	const date = new Date(Number(ts));
	const y = date.getFullYear();
	const m = pad(date.getMonth() + 1);
	const d = pad(date.getDate());
	const h = pad(date.getHours());
	const min = pad(date.getMinutes());
	return `${y}/${m}/${d} ${h}:${min}`;
}

// 时间格式化：2025/05/13
function formatDate(ts) {
	const date = new Date(Number(ts));
	const y = date.getFullYear();
	const m = pad(date.getMonth() + 1);
	const d = pad(date.getDate());
	return `${y}/${m}/${d}`;
}

function pad(n) {
	return n < 10 ? '0' + n : n;
}

// POST /api/detail_collected
router.post('/api/detail_collected', async function(req, res) {
	const {
		userId,
		courseId
	} = req.body;

	if (!userId || !courseId) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 userId 或 courseId 参数'
		});
	}

	try {
		const [rows] = await pool.query(`
			SELECT 1 FROM collections WHERE user_id = ? AND course_id = ?
		`, [userId, courseId]);

		if (rows.length > 0) {
			// 已收藏，取消收藏
			await pool.query(`
				DELETE FROM collections WHERE user_id = ? AND course_id = ?
			`, [userId, courseId]);

			return res.json({
				status: 200,
				data: {
					isCollected: false
				},
				desc: '取消收藏成功'
			});
		} else {
			// 未收藏，添加收藏并记录时间戳（毫秒）
			const timestamp = Date.now();

			await pool.query(`
				INSERT INTO collections (user_id, course_id, create_time) VALUES (?, ?, ?)
			`, [userId, courseId, timestamp]);

			return res.json({
				status: 200,
				data: {
					isCollected: true
				},
				desc: '收藏成功'
			});
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


module.exports = router;