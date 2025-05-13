// 用户登录注册
const express = require('express');
const router = express.Router();
const pool = require('../db/sql.js');

// 查询收藏课程
router.post('/api/getCollectCourse', async (req, res) => {
	const {
		userId,
		keyword = '',
		time,
		teacherId
	} = req.body;

	if (!userId) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 userId 参数'
		});
	}

	try {
		let conditions = [`c.course_id = coll.course_id`, `coll.user_id = ?`];
		let params = [userId];

		if (keyword) {
			conditions.push(`(
				c.title LIKE ? OR
				c.teacher_name LIKE ? OR
				c.course_id LIKE ?
			)`);
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
		}

		if (teacherId) {
			conditions.push(`c.teacher_id = ?`);
			params.push(teacherId);
		}

		if (time) {
			conditions.push(`? BETWEEN c.start_time AND c.end_time`);
			params.push(Number(time));
		}

		const query = `
			SELECT 
				c.course_id,
				c.title,
				c.teacher_name,
				c.teacher_id,
				c.background_image,
				c.address,
				c.start_time,
				c.end_time,
				c.create_time AS course_create_time,
				coll.create_time AS collect_time
			FROM collections coll
			JOIN courses c ON ${conditions.join(' AND ')}
			ORDER BY coll.create_time DESC
		`;

		const [rows] = await pool.query(query, params);

		const data = rows.map(item => ({
			...item,
			start_time: Number(new Date(item.start_time)),
			end_time: Number(new Date(item.end_time)),
			course_create_time: Number(new Date(item.course_create_time)),
			collect_time: Number(new Date(item.collect_time))
		}));

		res.json({
			status: 200,
			desc: '查询成功',
			data
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});

module.exports = router;