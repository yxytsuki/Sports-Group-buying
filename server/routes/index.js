const express = require('express');
const router = express.Router();
const db = require('../db/sql.js');

// 时间处理工具
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
	const h = pad(date.getHours());
	const min = pad(date.getMinutes());
	return `${h}:${min}`;
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
	console.log('后台')
	console.log(current, positionCurrent)
	const distanceCondition = current === 0 ? 'distance <= 3' : 'distance >= 3';
	let isRunningCondition = '';
	if (positionCurrent === 1) {
		isRunningCondition = 'AND is_running = 1';
	} else if (positionCurrent === 2) {
		isRunningCondition = 'AND is_running = 0';
	}

	const sql = `
    SELECT 
      c.course_id,
      c.title, 
      c.background_image,
      c.address,
      c.class_number,
      c.total_number,
      IFNULL(cs.currentNumber, 0) AS current_number,
      c.is_running,
      c.distance,
      c.start_time,
      c.end_time,
      c.week_day,
      c.teacher_name
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

		const filterItems = rows.map(row => ({
			cardItemId: row.course_id,
			isRunning: !!row.is_running,
			distance: row.distance.toFixed(1), // 保留一位小数
			title: row.title,
			backgroundImage: row.background_image,
			address: row.address,
			time: {
				startTime: formatFullTime(row.start_time),
				endTime: formatFullTime(row.end_time),
				day: row.week_day,
				during: formatDuring(row.start_time, row.end_time)
			},
			classNumber: row.class_number,
			studentNumber: row.current_number.toString(),
			totalNumber: row.total_number.toString()
		}));

		res.json({
			status: 200,
			desc: "请求成功",
			data: {
				filterItems,
				position: "浙江理工大学",
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
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: 500,
			desc: "服务器错误",
			data: {
				success: false
			}
		});
	}
});

module.exports = router;