// db.js
const mysql = require('mysql2/promise'); // 注意是 promise 模块

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'sportdb',
	waitForConnections: true,
	connectionLimit: 10, // 最大连接数
	queueLimit: 0 // 排队请求上限（0 表示无限制）
});

module.exports = pool; // 使用 promise 版本便于 async/await