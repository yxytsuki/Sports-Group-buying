const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db/sql.js');
const SECRET_KEY = 'my_super_secret_key_123';


router.get('/api/teacherIncome', async (req, res) => {
	const {
		teacher_id
	} = req.query;

	if (!teacher_id) {
		return res.status(400).json({
			status: 400,
			data: {},
			desc: '缺少参数teacher_id'
		});
	}

	try {
		const connection = await pool.getConnection();

		const now = Date.now();

		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const todayStartTime = todayStart.getTime();

		// 查询余额
		const [balanceRows] = await connection.query(
			'SELECT amount AS balance FROM users WHERE user_id = ? AND is_teacher = true',
			[teacher_id]
		);

		if (balanceRows.length === 0) {
			connection.release();
			return res.status(404).json({
				status: 404,
				data: {},
				desc: 'Teacher not found'
			});
		}

		const balance = parseFloat(balanceRows[0].balance || 0).toFixed(2);

		// 查询今日收入和订单数
		const [todayIncomeRows] = await connection.query(
			`
      SELECT 
        IFNULL(SUM(amount), 0) AS today_income,
        COUNT(*) AS today_orders
      FROM teacher_income
      WHERE teacher_id = ? AND create_time BETWEEN ? AND ?
      `,
			[teacher_id, todayStartTime, now]
		);

		const today_income = parseFloat(todayIncomeRows[0].today_income || 0).toFixed(2);
		const today_orders = parseInt(todayIncomeRows[0].today_orders || 0);

		// 查询总收入
		const [totalIncomeRows] = await connection.query(
			`
      SELECT IFNULL(SUM(amount), 0) AS total_income
      FROM teacher_income
      WHERE teacher_id = ?
      `,
			[teacher_id]
		);

		const total_income = parseFloat(totalIncomeRows[0].total_income || 0).toFixed(2);

		connection.release();

		return res.status(200).json({
			status: 200,
			data: {
				balance,
				today_income,
				today_orders,
				total_income
			},
			desc: 'success'
		});

	} catch (err) {
		console.error('Error fetching teacher income:', err);
		return res.status(500).json({
			status: 500,
			data: {},
			desc: '服务器错误'
		});
	}
});



// 上传课程
router.post('/api/createCourse', async (req, res) => {
	const {
		course_id,
		courseName,
		courseDesc,
		location,
		detailLocation,
		coverImage,
		price,
		courseNote,
		capacity,
		startDate,
		endDate,
		weekDays,
		dailyStartTime,
		dailyEndTime,
		is_online,
		teacher_id,
		teacher_name
	} = req.body;

	if (!courseName || !location || !detailLocation || !coverImage || !price || !capacity || !startDate ||
		!endDate || !weekDays || !dailyStartTime || !dailyEndTime || !teacher_id || !teacher_name) {
		return res.status(400).json({
			status: 400,
			desc: '缺少必要参数'
		});
	}

	try {
		const now = Date.now();
		const defaultNote =
			`1、支付成功则视为拼班成功<br>` +
			`2、所有支付的费用是该课程的实际价格<br>` +
			`3、报名截止时间可申请退款。报名截止后不可申请退款<br>` +
			`4、若遇到不可抗逆因素，退款会原路返回`;

		const startTime = Math.floor(new Date(startDate).getTime() / 1000);
		const endTime = Math.floor(new Date(endDate).getTime() / 1000);
		const distance = (Math.random() * 10).toFixed(1);

		let finalCourseId = course_id;
		let finalClassNumber = '';

		// 如果传入了 course_id，判断是否存在旧课程
		if (course_id) {
			const [exist] = await pool.query(`SELECT * FROM courses WHERE course_id = ?`, [course_id]);

			if (exist.length > 0) {
				// 已存在，执行 UPDATE
				await pool.query(`
					UPDATE courses SET 
						title = ?, teacher_id = ?, teacher_name = ?, total_number = ?,
						course_price = ?, background_image = ?, address = ?, address_detail = ?,
						course_desc = ?, course_msg = ?, is_running = ?, is_online = ?,
						start_time = FROM_UNIXTIME(?), end_time = FROM_UNIXTIME(?), 
						week_day = ?, distance = ?, create_time = FROM_UNIXTIME(?)
					WHERE course_id = ?
				`, [
					courseName, teacher_id, teacher_name, capacity,
					price, coverImage, location, detailLocation,
					courseDesc || '', courseNote || defaultNote, true,
					is_online !== undefined ? !!is_online : false,
					startTime, endTime,
					weekDays.join(','), distance, Math.floor(now / 1000),
					course_id
				]);

				finalClassNumber = exist[0].class_number;

				return res.json({
					status: 200,
					desc: '课程更新成功',
					data: {
						course_id,
						class_number: finalClassNumber
					}
				});
			}
		}

		// 否则执行新增流程
		const [rows] = await pool.query(`
			SELECT course_id, class_number FROM courses 
			ORDER BY CAST(course_id AS UNSIGNED) DESC, 
			         CAST(SUBSTRING(class_number, 2) AS UNSIGNED) DESC 
			LIMIT 1
		`);

		let nextCourseId = 1000;
		let nextClassNumber = 1000;

		if (rows.length > 0) {
			const lastCourseId = parseInt(rows[0].course_id, 10);
			const lastClassNum = parseInt(rows[0].class_number?.slice(1), 10);
			if (!isNaN(lastCourseId)) nextCourseId = lastCourseId + 1;
			if (!isNaN(lastClassNum)) nextClassNumber = lastClassNum + 1;
		}

		finalCourseId = String(nextCourseId);
		finalClassNumber = `c${String(nextClassNumber).padStart(4, '0')}`;

		await pool.query(`
			INSERT INTO courses (
				course_id, title, teacher_id, teacher_name, class_number, total_number,
				course_price, background_image, address, address_detail,
				course_desc, course_msg, is_running, is_online,
				start_time, end_time, week_day, distance, create_time
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?, ?, FROM_UNIXTIME(?))
		`, [
			finalCourseId,
			courseName,
			teacher_id,
			teacher_name,
			finalClassNumber,
			capacity,
			price,
			coverImage,
			location,
			detailLocation,
			courseDesc || '',
			courseNote || defaultNote,
			true,
			is_online !== undefined ? !!is_online : false,
			startTime,
			endTime,
			weekDays.join(','),
			distance,
			Math.floor(now / 1000)
		]);

		return res.json({
			status: 200,
			desc: '课程创建成功',
			data: {
				course_id: finalCourseId,
				class_number: finalClassNumber
			}
		});
	} catch (err) {
		console.error('创建/更新课程出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});
// 课程周期生成表
router.post('/api/courseWeek', async (req, res) => {
	const {
		course_id,
		startDate,
		endDate,
		dailyStartTime,
		dailyEndTime,
		weekDays
	} = req.body;

	if (!course_id || !startDate || !endDate || !dailyStartTime || !dailyEndTime || !Array.isArray(
			weekDays)) {
		return res.status(400).json({
			status: 400,
			desc: '缺少必要参数'
		});
	}

	try {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const startTimeParts = dailyStartTime.split(':').map(Number);
		const endTimeParts = dailyEndTime.split(':').map(Number);

		let weekNumber = 1;
		const inserts = [];

		for (
			let weekStart = new Date(start); weekStart <= end; weekStart.setDate(weekStart.getDate() + 7)
		) {
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 6);

			for (let day = 0; day < 7; day++) {
				const current = new Date(weekStart);
				current.setDate(weekStart.getDate() + day);
				const dayOfWeek = current.getDay(); // 0-6 表示周日到周六

				if (weekDays.includes(dayOfWeek) && current >= start && current <= end) {
					const sessionStart = new Date(current);
					sessionStart.setHours(startTimeParts[0], startTimeParts[1], 0, 0);

					const sessionEnd = new Date(current);
					sessionEnd.setHours(endTimeParts[0], endTimeParts[1], 0, 0);

					inserts.push([
						course_id,
						String(weekNumber),
						sessionStart.getTime(),
						sessionEnd.getTime()
					]);

					weekNumber++;
				}
			}
		}

		if (inserts.length === 0) {
			return res.status(400).json({
				status: 400,
				desc: '没有生成任何课程周期'
			});
		}

		await pool.query(`
			INSERT INTO course_weeks (course_id, week_number, week_start_time, week_end_time)
			VALUES ?
		`, [inserts]);

		return res.json({
			status: 200,
			desc: '课程周期插入成功',
			count: inserts.length
		});
	} catch (err) {
		console.error('生成课程周期出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});

// 教师收入明细
// /api/teacherIncome
router.get('/api/teacherIncomeDetail', async (req, res) => {
	const teacherId = req.query.teacher_id;
	if (!teacherId) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 teacher_id 参数'
		});
	}

	const now = Date.now(); // 当前时间戳，单位毫秒
	const startTime = now - 29 * 24 * 60 * 60 * 1000; // 30天前的毫秒时间戳

	const sql = `
    SELECT 
      FROM_UNIXTIME(create_time / 1000, '%Y-%m-%d') AS day,
      SUM(amount) AS total
    FROM teacher_income
    WHERE teacher_id = ?
      AND create_time BETWEEN ? AND ?
    GROUP BY day
    ORDER BY day ASC
  `;

	try {
		const [rows] = await pool.execute(sql, [teacherId, startTime, now]);

		const dailyIncome = [];
		const dailyMap = {};

		rows.forEach(row => {
			dailyMap[row.day] = parseFloat(row.total);
		});

		// 构造过去30天每天的收入数组
		for (let i = 0; i < 30; i++) {
			const date = new Date(startTime + i * 24 * 60 * 60 * 1000);
			const key = date.toISOString().slice(0, 10);
			dailyIncome.push(dailyMap[key] || 0);
		}

		// 4周收入，每周7天
		const weeklyIncome = [];
		for (let i = 0; i < 4; i++) {
			const weekSum = dailyIncome.slice(i * 7, i * 7 + 7).reduce((a, b) => a + b, 0);
			weeklyIncome.push(parseFloat(weekSum.toFixed(2)));
		}

		res.json({
			status: 200,
			desc: '获取成功',
			data: {
				dailyIncome,
				weeklyIncome
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


// 查询我的课程
router.get('/api/myClass', async (req, res) => {
	const {
		teacher_id
	} = req.query;

	if (!teacher_id) {
		return res.status(400).json({
			status: 400,
			data: {},
			desc: 'teacher_id is required',
		});
	}

	try {
		const connection = await pool.getConnection();

		const [courses] = await connection.query(
			`SELECT 
         course_id,
         title,
         start_time,
         end_time,
         address,
         class_number,
         total_number
       FROM courses
       WHERE teacher_id = ? AND is_online = 1`,
			[teacher_id]
		);

		if (courses.length === 0) {
			connection.release();
			return res.json({
				status: 200,
				data: [],
				desc: 'No courses found',
			});
		}

		const courseIds = courses.map(c => c.course_id);

		const [students] = await connection.query(
			`SELECT course_id, student_id, student_name, avatar
       FROM course_students
       WHERE course_id IN (?)`,
			[courseIds]
		);

		const studentsByCourse = {};
		for (const s of students) {
			if (!studentsByCourse[s.course_id]) {
				studentsByCourse[s.course_id] = [];
			}
			studentsByCourse[s.course_id].push({
				student_id: s.student_id,
				student_name: s.student_name,
				avatar: s.avatar,
			});
		}

		const data = courses.map(course => ({
			course_id: course.course_id,
			title: course.title,
			start_time: course.start_time,
			end_time: course.end_time,
			address: course.address,
			class_number: course.class_number,
			total_number: course.total_number,
			students: studentsByCourse[course.course_id] || [],
		}));

		connection.release();

		res.json({
			status: 200,
			data,
			desc: 'success',
		});
	} catch (error) {
		console.error('Error in /api/myClass:', error);
		res.status(500).json({
			status: 500,
			data: {},
			desc: '服务器错误',
		});
	}
});


module.exports = router;