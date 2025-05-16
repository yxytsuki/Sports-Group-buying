// 引入模块
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 设置上传目录
const uploadDir = path.join(__dirname, '../public/uploads/images');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, {
		recursive: true
	});
}

// 设置 multer 存储引擎和文件过滤
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function(req, file, cb) {
		const ext = path.extname(file.originalname);
		const filename = Date.now() + ext;
		cb(null, filename);
	}
});

const fileFilter = function(req, file, cb) {
	// 只允许上传图片
	if (!file.mimetype.startsWith('image/')) {
		return cb(new Error('只允许上传图片文件'));
	}
	cb(null, true);
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter
});

// 上传接口
router.post('/api/upload', upload.single('avatar'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({
			status: 400,
			desc: '未收到文件'
		});
	}

	const filePath = `/uploads/images/${req.file.filename}`;

	res.json({
		status: 200,
		url: filePath,
		desc: '上传成功'
	});
});

module.exports = router;