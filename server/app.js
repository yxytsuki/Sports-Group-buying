var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors'); // 引入cors包

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const detailRouter = require('./routes/detail')
const payRouter = require('./routes/pay.js');
const orderRouter = require('./routes/order.js');
const collectedRouter = require('./routes/collected.js')
const adminRouter = require('./routes/admin.js')
const studentRouter = require('./routes/student.js')
const teacherRouter = require('./routes/teacher.js')
const uploadRouter = require('./routes/upload.js')

var app = express();
// 启用CORS
app.use(cors({
	origin: '*', // 只允许前端地址访问
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的HTTP方法
	allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', detailRouter);
app.use('/', payRouter);
app.use('/', orderRouter);
app.use('/', collectedRouter);
app.use('/', adminRouter);
app.use('/', studentRouter);
app.use('/', teacherRouter);
app.use('/', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;