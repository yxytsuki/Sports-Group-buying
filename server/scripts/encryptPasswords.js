const bcrypt = require('bcrypt');
const pool = require('../db/sql.js');

async function encryptPasswords() {
	try {
		// 加密 users 表中的密码
		const [users] = await pool.query(`SELECT user_id, password FROM users`);
		for (const user of users) {
			if (user.password && !user.password.startsWith('$2')) {
				const hash = await bcrypt.hash(user.password, 10);
				await pool.query(`UPDATE users SET password = ? WHERE user_id = ?`, [hash, user.user_id]);
				console.log(`✅ 用户 ${user.user_id} 密码已加密`);
			}
		}

		// 加密 admins 表中的密码
		const [admins] = await pool.query(`SELECT admin_id, password FROM admins`);
		for (const admin of admins) {
			if (admin.password && !admin.password.startsWith('$2')) {
				const hash = await bcrypt.hash(admin.password, 10);
				await pool.query(`UPDATE admins SET password = ? WHERE admin_id = ?`, [hash, admin.admin_id]);
				console.log(`✅ 管理员 ${admin.admin_id} 密码已加密`);
			}
		}

		console.log('\n🎉 所有明文密码加密完毕');
		process.exit(0);
	} catch (err) {
		console.error('❌ 加密失败:', err);
		process.exit(1);
	}
}

encryptPasswords();