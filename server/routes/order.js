const express = require('express');
const router = express.Router();
const db = require('../db/sql.js');

// 获取筛选订单接口
router.get('/api/getFilterOrder', async (req, res) => {
	const {
		userId,
		current
	} = req.query;

	if (!userId) {
		return res.status(400).json({
			status: 400,
			data: {},
			desc: 'userId 参数缺失'
		});
	}

	let params = [userId];
	let condition = 'WHERE o.user_id = ?';

	// 状态筛选逻辑
	if (parseInt(current) === 1) {
		condition += ' AND o.is_pay = 0';
	} else if (parseInt(current) === 2) {
		condition += ' AND o.is_pay = 1 AND o.status = "拼班中"';
	} else if (parseInt(current) === 3) {
		condition += ' AND o.is_pay = 1 AND o.status = "已完成"';
	}

	// 查询 SQL
	const sql = `
		SELECT 
			o.*, 
			c.start_time AS course_start_time,
			c.end_time AS course_end_time,
			c.title AS course_title
		FROM orders o
		LEFT JOIN courses c ON o.course_id = c.course_id
		${condition}
		ORDER BY o.order_createTime DESC
	`;

	try {
		const [rows] = await db.query(sql, params);

		res.json({
			status: 200,
			data: {
				list: rows.map(item => ({
					...item,
					start_time: item
						.course_start_time,
					end_time: item
						.course_end_time,
					title: item
						.course_title
				}))
			},
			desc: '获取订单列表成功'
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 500,
			data: {},
			desc: '数据库查询失败'
		});
	}
});


// 删除订单
router.delete('/api/delOrder', async (req, res) => {
	const {
		orderId
	} = req.query; // 使用 DELETE 方法推荐从 query 获取参数

	if (!orderId) {
		return res.status(400).json({
			code: 1,
			msg: '缺少 orderId 参数'
		});
	}

	try {
		const [result] = await db.query('DELETE FROM orders WHERE order_id = ?', [
			orderId
		]);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				code: 1,
				msg: '订单不存在或已被删除'
			});
		}

		res.json({
			code: 0,
			msg: '订单删除成功'
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			code: 1,
			msg: '数据库操作失败'
		});
	}
});

// 提交评价
router.post('/api/addReview', async (req, res) => {
	const {
		order_id,
		user_id,
		course_id,
		rating,
		content
	} = req.body;

	if (!order_id || !user_id || !course_id || !rating) {
		return res.status(400).json({
			code: 1,
			msg: '缺少必要参数'
		});
	}

	const create_time = Math.floor(Date.now() / 1000);

	try {
		const sql = `
      INSERT INTO order_reviews (order_id, user_id, course_id, rating, content, create_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
		const [result] = await db.query(sql, [order_id, user_id, course_id, rating,
			content || '', create_time
		]);

		res.json({
			code: 0,
			msg: '评价提交成功',
			review_id: result.insertId
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			code: 1,
			msg: '数据库操作失败'
		});
	}
});



module.exports = router;