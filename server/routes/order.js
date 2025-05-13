const express = require('express');
const router = express.Router();
const db = require('../db/sql.js');

router.get('/api/getFilterOrder', async (req, res) => {
	const {
		userId,
		current
	} = req.query;

	if (!userId) {
		return res.status(400).json({
			code: 1,
			msg: 'userId 参数缺失'
		});
	}

	const now = Math.floor(Date.now() / 1000);
	let condition = 'WHERE o.user_id = ?';
	let params = [userId];

	// 根据 current 动态设置 JOIN 和 SELECT 字段
	let selectFields = 'o.*';
	let joinClause = '';

	switch (parseInt(current)) {
		case 1: // 未支付
			condition += ' AND o.is_pay = 0';
			break;
		case 2: // 拼班中
			joinClause = `
        LEFT JOIN course_weeks cw 
          ON cw.course_id = o.course_id 
         AND o.order_createTime BETWEEN cw.week_start_time AND cw.week_end_time
      `;
			condition += ' AND o.is_pay = 1 AND cw.week_end_time > ?';
			params.push(now);
			selectFields += ', cw.week_start_time, cw.week_end_time';
			break;
		case 3: // 已完成
			joinClause = `
        LEFT JOIN course_weeks cw 
          ON cw.course_id = o.course_id 
         AND o.order_createTime BETWEEN cw.week_start_time AND cw.week_end_time
      `;
			condition += ' AND o.is_pay = 1 AND cw.week_end_time <= ?';
			params.push(now);
			selectFields += ', cw.week_start_time, cw.week_end_time';
			break;
			// case 0 默认：全部订单，不修改
	}

	const sql = `
    SELECT ${selectFields}
    FROM orders o
    ${joinClause}
    ${condition}
    ORDER BY o.order_createTime DESC
  `;

	try {
		const [rows] = await db.query(sql, params);
		res.json({
			code: 0,
			data: rows
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			code: 1,
			msg: '数据库查询失败'
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