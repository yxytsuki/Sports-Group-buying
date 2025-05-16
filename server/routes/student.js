const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/sql.js');

// 模糊查询学生
// routes/admin.js 中追加
router.get('/api/admin/students', async (req, res) => {
	const {
		user_id,
		user_name,
		nickName,
		account,
		page = 1,
		pageSize = 10
	} = req.query;

	let sql = `
		SELECT user_id, user_name, nickName, avatar, amount, is_teacher, is_certified, create_time, description
		FROM users
		WHERE is_teacher = false
	`;
	const params = [];

	if (user_id) {
		sql += ' AND user_id LIKE ?';
		params.push(`%${user_id}%`);
	}
	if (user_name) {
		sql += ' AND user_name LIKE ?';
		params.push(`%${user_name}%`);
	}
	if (nickName) {
		sql += ' AND nickName LIKE ?';
		params.push(`%${nickName}%`);
	}
	if (account) {
		sql += ' AND user_id LIKE ?';
		params.push(`%${account}%`);
	}

	// 添加分页
	const offset = (parseInt(page) - 1) * parseInt(pageSize);
	sql += ' LIMIT ? OFFSET ?';
	params.push(parseInt(pageSize), offset);

	try {
		const [rows] = await pool.query(sql, params);

		// 查询总数
		let countSql = 'SELECT COUNT(*) AS total FROM users WHERE is_teacher = false';
		const countParams = [];

		if (user_id) {
			countSql += ' AND user_id LIKE ?';
			countParams.push(`%${user_id}%`);
		}
		if (user_name) {
			countSql += ' AND user_name LIKE ?';
			countParams.push(`%${user_name}%`);
		}
		if (nickName) {
			countSql += ' AND nickName LIKE ?';
			countParams.push(`%${nickName}%`);
		}
		if (account) {
			countSql += ' AND user_id LIKE ?';
			countParams.push(`%${account}%`);
		}

		const [countRows] = await pool.query(countSql, countParams);
		const total = countRows[0].total;

		res.json({
			status: 200,
			desc: '查询成功',
			data: {
				list: rows,
				total,
				page: parseInt(page),
				pageSize: parseInt(pageSize)
			}
		});
	} catch (err) {
		console.error('查询学生出错:', err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


// 查询某个学生详情
// 根据 user_id 查询学生详情
router.get('/api/admin/getStudentDetail', async (req, res) => {
	const {
		user_id
	} = req.query;

	if (!user_id) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 user_id 参数'
		});
	}

	try {
		const [rows] = await pool.query(
			`SELECT user_id, user_name, nickName, avatar, amount, password, is_teacher, is_certified, description, create_time 
			 FROM users 
			 WHERE user_id = ?`,
			[user_id]
		);

		if (rows.length === 0) {
			return res.status(404).json({
				status: 404,
				desc: '未找到该学生'
			});
		}

		res.json({
			status: 200,
			desc: '查询成功',
			data: rows[0] // password 会包含在返回里
		});
	} catch (err) {
		console.error('查询学生详情出错:', err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


// 添加/修改/编辑学生

router.post('/api/admin/addStudent', async (req, res) => {
	const {
		user_id,
		user_name,
		nickName,
		avatar,
		password,
		is_teacher,
		is_certified,
		description,
		phone
	} = req.body;

	if (!user_id) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 user_id 参数'
		});
	}

	try {
		const [users] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [user_id]);

		if (users.length > 0) {
			const fieldMap = {
				user_name,
				nickName,
				avatar,
				is_teacher,
				is_certified,
				description,
				phone
			};

			const updateFields = [];
			const updateParams = [];

			for (const [key, value] of Object.entries(fieldMap)) {
				if (value !== undefined && value !== null && value !== '') {
					updateFields.push(`${key} = ?`);
					updateParams.push(value);
				}
			}

			if (password) {
				const hashedPassword = await bcrypt.hash(password, 10);
				updateFields.push(`password = ?`);
				updateParams.push(hashedPassword);
			}

			if (updateFields.length === 0) {
				return res.status(400).json({
					status: 400,
					desc: '没有可更新的字段'
				});
			}

			updateParams.push(user_id);
			const updateSql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;

			await pool.query(updateSql, updateParams);

			return res.json({
				status: 200,
				desc: '学生信息已更新'
			});
		} else {
			if (!user_name || !phone) {
				return res.status(400).json({
					status: 400,
					desc: '新增学生必须提供 user_name 和 phone'
				});
			}

			const randomAmount = (Math.random() * 9000 + 1000).toFixed(2);
			const hashedPassword = await bcrypt.hash(password || '123456', 10); // 默认密码

			await pool.query(
				`INSERT INTO users (
					user_id, user_name, nickName, avatar, amount, password,
					is_teacher, is_certified, description, phone
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					user_id,
					user_name,
					nickName || '',
					avatar || '',
					randomAmount,
					hashedPassword,
					is_teacher ?? false,
					is_certified ?? false,
					description || '',
					phone
				]
			);

			return res.json({
				status: 200,
				desc: '新学生已添加',
				randomAmount
			});
		}
	} catch (err) {
		console.error('添加/更新学生出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


// 删除学生

router.post('/api/admin/deleteStudent', async (req, res) => {
	const {
		user_id
	} = req.body;

	if (!user_id) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 user_id 参数'
		});
	}

	try {
		const [users] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [user_id]);
		if (users.length === 0) {
			return res.status(404).json({
				status: 404,
				desc: '该学生不存在'
			});
		}

		// 先删除外键关联表中的记录
		await pool.query(`DELETE FROM course_students WHERE student_id = ?`, [user_id]);
		await pool.query(`DELETE FROM orders WHERE user_id = ?`, [user_id]);

		// 如果还有其他外键表也要继续删...

		// 再删除用户记录
		await pool.query(`DELETE FROM users WHERE user_id = ?`, [user_id]);

		return res.json({
			status: 200,
			desc: '学生删除成功'
		});
	} catch (err) {
		console.error('删除学生出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


// 管理员查询学生列表
// GET /api/admin/getStudents
router.get('/api/admin/getStudents', async (req, res) => {
	const {
		keyword = ''
	} = req.query;
	const sqlBase = `
    SELECT user_id, user_name, nickName, avatar, phone, description, amount,
           is_teacher, is_certified, create_time
    FROM users
    WHERE is_teacher = 0
  `;

	try {
		let sql, params;
		if (keyword.trim() === '') {
			sql = sqlBase + ' ORDER BY create_time DESC';
			params = [];
		} else {
			sql = sqlBase + `
        AND (
          user_name LIKE ?
          OR nickName LIKE ?
          OR phone LIKE ?
        )
        ORDER BY create_time DESC
      `;
			const likeKeyword = `%${keyword}%`;
			params = [likeKeyword, likeKeyword, likeKeyword];
		}

		const [rows] = await pool.query(sql, params);

		res.json({
			status: 200,
			message: '获取学生列表成功',
			data: rows
		});
	} catch (error) {
		console.error('查询学生出错:', error);
		res.status(500).json({
			code: 1,
			message: '服务器内部错误'
		});
	}
});


// 教师端  模糊查询报名学生
router.get('/api/teacherStudents', async (req, res) => {
	const {
		teacher_id,
		keyword
	} = req.query;

	if (!teacher_id) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 teacher_id 参数'
		});
	}

	try {
		let sql = `
			SELECT 
				cs.enrollment_id,         -- 加上报名记录的唯一 ID
				cs.student_id,
				u.user_name,
				u.nickName,
				u.avatar,
				cs.title,
				cs.course_id
			FROM course_students cs
			JOIN users u ON cs.student_id = u.user_id
			WHERE cs.teacher_id = ?
		`;
		const params = [teacher_id];

		if (keyword) {
			sql += ` AND (
				u.nickName LIKE ?
				OR u.user_id LIKE ?
				OR cs.title LIKE ?
			)`;
			const fuzzy = `%${keyword}%`;
			params.push(fuzzy, fuzzy, fuzzy);
		}

		// 确保同一个学生报同一个课程只返回一条记录
		sql += ` GROUP BY cs.student_id, cs.course_id`;

		const [students] = await pool.query(sql, params);

		return res.json({
			status: 200,
			desc: '查询成功',
			data: students
		});
	} catch (err) {
		console.error('查询学生出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


// 从学生报名表里移除学生
router.post('/api/delCourse_student', async (req, res) => {
	const {
		enrollment_id
	} = req.body;

	if (!enrollment_id) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 enrollment_id 参数'
		});
	}

	try {
		// 查询是否存在该记录
		const [rows] = await pool.query(
			'SELECT * FROM course_students WHERE enrollment_id = ?',
			[enrollment_id]
		);

		if (rows.length === 0) {
			return res.json({
				status: 200,
				desc: '该报名记录不存在',
				data: null
			});
		}

		// 执行删除
		await pool.query(
			'DELETE FROM course_students WHERE enrollment_id = ?',
			[enrollment_id]
		);

		return res.json({
			status: 200,
			desc: '删除成功',
			data: {
				enrollment_id
			}
		});
	} catch (err) {
		console.error('删除报名记录出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});
// 学生报名表详情
function formatDateTime(date) {
	const d = new Date(date);
	const pad = (n) => (n < 10 ? '0' + n : n);

	const year = d.getFullYear();
	const month = pad(d.getMonth() + 1);
	const day = pad(d.getDate());
	const hours = pad(d.getHours());
	const minutes = pad(d.getMinutes());
	const seconds = pad(d.getSeconds());

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

router.get('/api/teacher/studentDetail', async (req, res) => {
	const {
		enrollment_id
	} = req.query;

	if (!enrollment_id) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 enrollment_id 参数'
		});
	}

	try {
		const sql = `
			SELECT 
				u.user_id AS student_id,
				u.user_name,
				u.nickName,
				u.avatar,
				u.phone,
				u.create_time AS register_time,
				cs.enrollment_createTime AS enrollment_time
			FROM course_students cs
			JOIN users u ON cs.student_id = u.user_id
			WHERE cs.enrollment_id = ?
			LIMIT 1
		`;

		const [rows] = await pool.query(sql, [enrollment_id]);

		if (rows.length === 0) {
			return res.status(404).json({
				status: 404,
				desc: '未找到报名记录'
			});
		}

		const student = rows[0];

		// 格式化时间字段
		student.register_time = formatDateTime(student.register_time);
		student.enrollment_time = formatDateTime(student.enrollment_time);

		return res.json({
			status: 200,
			desc: '查询成功',
			data: student
		});
	} catch (err) {
		console.error('查询学生报名详情出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


module.exports = router;