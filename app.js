const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const fs = require('fs');

// view engine setup
app.set('view engine', 'jade');
//логер, не буду использовать
app.use(logger('dev'));
//По умолчанию нету в запросах body, строчки ниже будут их делать
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//
app.use(cookieParser());
/*конструкция роута
http://localhost:3000/api/register
*/
// Раздавать статические файлы из папки 'uploads'
app.use('/uploads', express.static('uploads'));

//как обращаться и откуда брать api
app.use('/api', require('./routes'));
//нужно проверить, если папка uploads
//нужна библиотека fs, она уже стоит (файл систем)
//fs.проверь наличие uploads
if (!fs.existsSync('uploads')) {
	//если нету, создай папку
	fs.mkdirSync('uploads');
}
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
