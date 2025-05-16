// 用户登录注册
const express = require('express');
const router = express.Router();
const pool = require('../db/sql.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'my_super_secret_key_123'; // 换成你项目的密钥
const TOKEN_EXPIRES_IN = '7d'; // Token 有效期

// 获取用户信息（不包含 user_id 和 password）
router.get('/api/getUser', async (req, res) => {
	const {
		userId
	} = req.query;

	if (!userId) {
		return res.status(400).json({
			status: 400,
			data: {},
			desc: '缺少 userId 参数'
		});
	}

	try {
		const [rows] = await pool.query(
			'SELECT user_name, nickName, avatar, amount, is_teacher, is_certified FROM users WHERE user_id = ?',
			[userId]
		);

		if (rows.length === 0) {
			return res.status(404).json({
				status: 404,
				data: {},
				desc: '用户不存在'
			});
		}

		res.status(200).json({
			status: 200,
			data: rows[0],
			desc: '查询成功'
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


// 获取验证码接口
router.post('/api/getCode', (req, res) => {
	const {
		phone,
	} = req.body;

	if (!phone) {
		return res.status(400).json({
			status: 400,
			desc: '手机号不能为空',
		});
	}

	// 生成6位随机验证码
	const code = Math.floor(100000 + Math.random() * 900000).toString();

	// 这里应将验证码保存到缓存或数据库，绑定 phone，设置过期时间（例如5分钟）
	// 示例仅测试使用，返回验证码
	console.log(`手机号 ${phone} 的验证码为: ${code}`);

	res.json({
		status: 200,
		desc: '验证码发送成功（测试环境直接返回）',
		data: {
			code
		} // 测试阶段返回验证码
	});
});


// 登录或注册接口

router.post('/api/login', async (req, res) => {
	const {
		phone,
		code
	} = req.body;

	if (!phone || !code) {
		return res.status(400).json({
			status: 400,
			desc: '手机号或验证码不能为空'
		});
	}

	const cleanPhone = phone.trim();

	try {
		// 查找是否已存在用户
		const [users] = await pool.query('SELECT * FROM users WHERE phone = ?', [cleanPhone]);
		console.log('传入手机号:', cleanPhone);
		console.log('数据库返回用户:', users);

		let user = users[0];
		console.log(user)
		let isNewUser = false;

		if (!user) {
			isNewUser = true;

			// 获取最大 user_id 并生成新的
			const [rows] = await pool.query('SELECT MAX(CAST(user_id AS UNSIGNED)) AS maxId FROM users');
			const maxId = rows[0].maxId || 100099;
			const newUserId = (parseInt(maxId) + 1).toString();

			// 随机余额、默认昵称与密码
			const amount = (Math.floor(Math.random() * 9000) + 1000).toFixed(2);
			const nickName = '用户' + cleanPhone.slice(-4);
			const hashedPassword = await bcrypt.hash('123456', 10);

			// 插入新用户（包含 phone）
			await pool.query(
				`INSERT INTO users (user_id, user_name, nickName, password, amount, phone)
         VALUES (?, ?, ?, ?, ?, ?)`,
				[newUserId, cleanPhone, nickName, hashedPassword, amount, cleanPhone]
			);

			const [newUser] = await pool.query('SELECT * FROM users WHERE user_id = ?', [newUserId]);
			user = newUser[0];
		}

		// 生成 token
		const token = jwt.sign({
				userId: user.user_id
			},
			SECRET_KEY, {
				expiresIn: TOKEN_EXPIRES_IN
			}
		);
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 天后

		// 存入 token 表
		await pool.query(
			`INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
			[user.user_id, token, expiresAt]
		);

		return res.status(200).json({
			status: 200,
			desc: isNewUser ? '注册成功' : '登录成功',
			data: {
				user_id: user.user_id,
				nickName: user.nickName,
				avatar: user.avatar,
				amount: user.amount,
				is_teacher: user.is_teacher,
				is_certified: user.is_certified,
				token: token
			}
		});
	} catch (err) {
		console.error('登录出错:', err);
		return res.status(500).json({
			status: 500,
			desc: '服务器错误',
			data: {}
		});
	}
});



router.post('/api/updateUserInfo', async (req, res) => {
	const {
		userId,
		nickName,
		avatar,
		payPassword,
		description
	} = req.body;

	if (!userId) {
		return res.status(400).json({
			status: 400,
			desc: '缺少 userId 参数'
		});
	}

	try {
		// 构建 SQL 更新语句
		const fields = [];
		const values = [];

		if (nickName) {
			fields.push('nickName = ?');
			values.push(nickName);
		}

		if (avatar) {
			fields.push('avatar = ?');
			values.push(avatar);
		}

		if (payPassword) {
			const hashedPassword = await bcrypt.hash(payPassword, 10);
			fields.push('password = ?');
			values.push(hashedPassword);
		}

		if (description) {
			fields.push('description = ?');
			values.push(description);
		}

		if (fields.length === 0) {
			return res.status(400).json({
				status: 400,
				desc: '未提供任何需要更新的字段'
			});
		}

		values.push(userId);

		const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
		await pool.query(sql, values);

		res.json({
			status: 200,
			desc: '用户信息更新成功'
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});

// 登出
router.post('/api/logout', async (req, res) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // 提取 Bearer token

	if (!token) {
		return res.status(401).json({
			status: 401,
			desc: '未提供 token'
		});
	}

	try {
		// 验证 token
		const decoded = jwt.verify(token, SECRET_KEY);
		const userId = decoded.userId;
		// 删除无效token
		await pool.query(
			`UPDATE user_tokens SET is_active = FALSE WHERE token = ? AND user_id = ?`,
			[token, userId]
		);

		return res.status(200).json({
			status: 200,
			desc: '退出登录成功'
		});
	} catch (err) {
		console.error('token 验证失败', err);
		return res.status(401).json({
			status: 401,
			desc: '无效的 token，退出失败'
		});
	}
});

module.exports = router;