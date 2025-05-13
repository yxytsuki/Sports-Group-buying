const express = require('express');
const router = express.Router();
const pool = require('../db/sql.js');
const bcrypt = require('bcrypt');
const {
	v4: uuidv4
} = require('uuid');


// 生成顺序 order_id，如 "o1001"
async function generateNextOrderId(pool) {
	const [rows] = await pool.query(`SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1`);
	if (rows.length === 0) return 'o1000';
	const lastId = rows[0].order_id;
	const nextId = parseInt(lastId.slice(1), 10) + 1;
	return `o${nextId}`;
}

// 时间格式化工具
function formatTime(ts) {
	const date = new Date(ts);
	return date.toISOString().slice(0, 19).replace('T', ' ');
}

function formatHour(ts) {
	const date = new Date(ts);
	return date.toTimeString().slice(0, 8);
}

// 创建订单接口
router.get('/api/createOrder', async (req, res) => {
	const {
		courseId,
		userId
	} = req.query;

	if (!courseId || !userId) {
		return res.status(400).json({
			status: 400,
			desc: '必须提供 courseId 和 userId 参数'
		});
	}

	try {
		const [courses] = await pool.query(`SELECT * FROM courses WHERE course_id = ?`, [courseId]);
		if (courses.length === 0) {
			return res.status(404).json({
				status: 404,
				desc: '未找到对应课程'
			});
		}

		const course = courses[0];
		const order_id = await generateNextOrderId(pool);
		const order_number = Date.now().toString(); // 唯一编号
		const amount = parseFloat(course.course_price);
		const status = '待支付';
		const is_pay = false;
		const order_createTime = Date.now(); // 当前时间戳（毫秒）

		await pool.query(
			`INSERT INTO orders (order_id, order_number, course_id, user_id, amount, is_pay, order_createTime, status)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[order_id, order_number, courseId, userId, amount, is_pay, order_createTime, status]
		);

		const response = {
			orderId: order_id,
			courseId,
			orderNumber: order_number,
			title: course.title,
			amount,
			isPay: is_pay,
			creatTime: order_createTime, // 时间戳
			totalNumber: course.total_number,
			adress: course.address,
			time: {
				startTime: course.start_time,
				endTime: course.end_time,
				day: [Number(course.week_day)],
				weeks: {
					weekstartTime: course.start_time,
					weekendTime: course.end_time,
				},
			},
			status: status,
		};

		return res.json({
			status: 200,
			data: response,
			desc: '请求成功'
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});

// 支付接口
router.post('/api/pay', async (req, res) => {
	const {
		orderId,
		payPassword
	} = req.body;

	if (!orderId || !payPassword) {
		return res.status(400).json({
			status: 400,
			desc: '缺少参数'
		});
	}
	console.log(orderId)
	try {
		const [orderRows] = await pool.query(`SELECT * FROM orders WHERE order_id = ?`, [orderId]);

		if (orderRows.length === 0) {
			return res.json({
				status: 200,
				data: {
					isTrade: false
				},
				desc: '订单不存在'
			});
		}

		const order = orderRows[0];
		console.log(order)
		console.log(order.is_pay)
		if (Boolean(order.is_pay)) {
			return res.json({
				status: 200,
				data: {
					isTrade: false
				},
				desc: '订单已支付'
			});
		}

		const [userRows] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [order.user_id]);
		if (userRows.length === 0) {
			return res.json({
				status: 200,
				data: {
					isTrade: false
				},
				desc: '用户不存在'
			});
		}

		const user = userRows[0];

		const isPasswordMatch = await bcrypt.compare(payPassword, user.password);
		if (!isPasswordMatch) {
			return res.json({
				status: 200,
				data: {
					isTrade: false
				},
				desc: '支付密码错误'
			});
		}

		const userAmount = parseFloat(user.amount);
		const orderAmount = parseFloat(order.amount);

		if (userAmount < orderAmount) {
			return res.json({
				status: 200,
				data: {
					isTrade: false
				},
				desc: '余额不足'
			});
		}

		const [courseRows] = await pool.query(`SELECT * FROM courses WHERE course_id = ?`, [order
			.course_id
		]);
		if (courseRows.length === 0) {
			return res.json({
				status: 200,
				data: {
					isTrade: false
				},
				desc: '课程不存在'
			});
		}

		const course = courseRows[0];
		const teacherId = course.teacher_id;
		const conn = await pool.getConnection();
		const payTime = Date.now(); // 当前时间戳（毫秒）

		try {
			await conn.beginTransaction();

			// 扣款、加款
			await conn.query(`UPDATE users SET amount = amount - ? WHERE user_id = ?`, [orderAmount, order
				.user_id
			]);
			await conn.query(`UPDATE users SET amount = amount + ? WHERE user_id = ?`, [orderAmount,
				teacherId
			]);

			// 老师收入记录
			await conn.query(`
				INSERT INTO teacher_income (teacher_id, amount, order_id)
				VALUES (?, ?, ?)
			`, [teacherId, orderAmount, order.order_id]);

			// 学生加入课程
			await conn.query(`
				INSERT INTO course_students (course_id, student_id, student_name, avatar)
				VALUES (?, ?, ?, ?)
			`, [course.course_id, user.user_id, user.nickName || user.user_name, user.avatar]);

			// 更新订单为已支付
			await conn.query(`
				UPDATE orders SET is_pay = true, status = '拼班中', pay_time = ?
				WHERE order_id = ?
			`, [payTime, orderId]);

			await conn.commit();

			return res.json({
				status: 200,
				data: {
					orderNumber: order.order_number,
					payTime, // 返回的是时间戳（毫秒）
					amount: orderAmount,
					isTrade: true,
				},
				desc: '请求成功',
			});
		} catch (err) {
			await conn.rollback();
			console.error(err);
			return res.status(500).json({
				status: 500,
				desc: '服务器错误'
			});
		} finally {
			conn.release();
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