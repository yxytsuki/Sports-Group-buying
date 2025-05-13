const express = require('express');
const router = express.Router();
const db = require('../db/sql.js');
const Course = require('../models/Course');

// 统一时间戳或字符串 → Date 对象
function safeDate(input) {
	const date = new Date(Number(input));
	if (!isNaN(date)) return date;
	const date2 = new Date(input);
	return isNaN(date2) ? null : date2;
}

function pad(n) {
	return n < 10 ? '0' + n : n;
}

function formatFullTime(ts) {
	const date = safeDate(ts);
	if (!date) return '';
	const y = date.getFullYear();
	const m = pad(date.getMonth() + 1);
	const d = pad(date.getDate());
	const h = pad(date.getHours());
	const min = pad(date.getMinutes());
	return `${y}/${m}/${d} ${h}:${min}`;
}

function formatDate(ts) {
	const date = safeDate(ts);
	if (!date) return '';
	const y = date.getFullYear();
	const m = pad(date.getMonth() + 1);
	const d = pad(date.getDate());
	return `${y}/${m}/${d}`;
}

function formatDuring(startTs, endTs) {
	if (!startTs || !endTs) return '';
	return `${formatDate(startTs)}~${formatDate(endTs)}`;
}

// 课程筛选接口
router.get('/api/index_list/filterdata', async function(req, res) {
	const current = parseInt(req.query.current) || 0;
	const positionCurrent = parseInt(req.query.positionCurrent) || 0;

	const distanceCondition = current === 0 ? 'distance <= 3' : 'distance >= 3';
	let isRunningCondition = '';
	if (positionCurrent === 1) {
		isRunningCondition = 'AND is_running = 1';
	} else if (positionCurrent === 2) {
		isRunningCondition = 'AND is_running = 0';
	}

	const sql = `
    SELECT 
      c.course_id AS courseId,
      c.title, 
      c.background_image AS backgroundImage,
      c.address, 
      c.address_detail AS adressDetail,
      c.class_number AS classNumber, 
      IFNULL(cs.currentNumber, 0) AS currentNumber,
      c.total_number AS totalNumber, 
      c.is_running AS isRunning, 
      c.distance,
      c.start_time AS startTime,
      c.end_time AS endTime,
      c.week_day AS day,
      c.teacher_name AS teacherName,
      c.course_price AS coursePrice,
      c.course_desc AS courseDesc,
      c.course_msg AS courseMsg
    FROM courses c
    LEFT JOIN (
      SELECT course_id, COUNT(*) AS currentNumber
      FROM course_students
      GROUP BY course_id
    ) cs ON c.course_id = cs.course_id
    WHERE ${distanceCondition} ${isRunningCondition}
  `;

	try {
		const [rows] = await db.query(sql);

		const cardItemList = rows.map(row => new Course({
			...row,
			time: {
				startTime: formatFullTime(row.startTime),
				endTime: formatFullTime(row.endTime),
				day: row.day,
				during: formatDuring(row.startTime, row.endTime)
			}
		}));

		res.json({
			status: 200,
			data: {
				success: true,
				position: "浙江理工大学",
				cardItemList,
				bannerList: [{
						bannerId: "01",
						bannerImage: "https://img0.baidu.com/it/u=1391067602,1226818753&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=303"
					},
					{
						bannerId: "02",
						bannerImage: "https://img0.baidu.com/it/u=875867425,2786971444&fm=253&fmt=auto&app=138&f=JPEG?w=686&h=342"
					},
					{
						bannerId: "03",
						bannerImage: "https://img1.baidu.com/it/u=3890786179,86584231&fm=253&fmt=auto&app=138&f=JPEG?w=759&h=313"
					},
					{
						bannerId: "04",
						bannerImage: "https://img2.baidu.com/it/u=1749567038,1491802467&fm=253&fmt=auto&app=138&f=JPEG?w=759&h=332"
					}
				]
			},
			desc: "请求成功"
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: 500,
			data: {
				success: false
			},
			desc: "服务器错误"
		});
	}
});

module.exports = router;