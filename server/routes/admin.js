// routes/admin.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/sql.js');

// 密钥（建议放在 .env 中）
const SECRET_KEY = 'your_secret_key';

// 管理员登录接口
router.post('/api/admin/login', async (req, res) => {
	const {
		account,
		password
	} = req.body;

	if (!account || !password) {
		return res.status(400).json({
			status: 400,
			desc: '缺少账号或密码'
		});
	}

	try {
		// 查找管理员
		const [admins] = await pool.query(`SELECT * FROM admins WHERE account = ?`, [account]);

		if (admins.length === 0) {
			return res.status(401).json({
				status: 401,
				desc: '账号不存在'
			});
		}

		const admin = admins[0];

		// 校验密码
		const match = await bcrypt.compare(password, admin.password);
		if (!match) {
			return res.status(401).json({
				status: 401,
				desc: '密码错误'
			});
		}

		// 生成 JWT token（有效期 7 天）
		const token = jwt.sign({
			admin_id: admin.admin_id
		}, SECRET_KEY, {
			expiresIn: '7d'
		});
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7天后时间戳

		// 存入 admin_tokens 表
		await pool.query(`
			INSERT INTO admin_tokens (admin_id, token, expires_at)
			VALUES (?, ?, ?)`, [admin.admin_id, token, expiresAt]);

		// 登录成功
		res.json({
			status: 200,
			desc: '登录成功',
			data: {
				admin_id: admin.admin_id,
				account: admin.account,
				token
			}
		});
	} catch (err) {
		console.error('管理员登录出错:', err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});

// 管理员退出登录
router.post('/api/admin/logout', async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1]; // 从 Authorization 头获取 token（格式：Bearer token）
	console.log(req.headers)
	console.log(token)
	if (!token) {
		return res.status(401).json({
			status: 401,
			desc: '缺少 token'
		});
	}

	try {
		// 将对应 token 设置为无效（is_active = false）
		const [result] = await pool.query(
			`UPDATE admin_tokens SET is_active = FALSE WHERE token = ?`,
			[token]
		);

		if (result.affectedRows === 0) {
			return res.status(401).json({
				status: 401,
				desc: '无效的 token 或已退出'
			});
		}

		res.json({
			status: 200,
			desc: '退出登录成功'
		});
	} catch (err) {
		console.error('退出登录失败:', err);
		res.status(500).json({
			status: 500,
			desc: '服务器错误'
		});
	}
});


module.exports = router;