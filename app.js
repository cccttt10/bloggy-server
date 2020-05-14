require('babel-register');

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');

const app = express();

/*
TODO: configure view engine
*/

/*
use logger
*/
app.use(logger('dev'));

/*
configure express
*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*
configure cookie
*/
app.use(cookieParser('blog_server_cookie'));
app.use(
    session({
        secret: 'blog_server_cookie',
        name: 'session_id', // cookie key in browser, default is connect.sid
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 1000 * 30, httpOnly: true }, // expiry date
    })
);

/*
TODO: connect to db
*/

/*
TODO: configure routes
*/

/*
catch 404 and forward to error handler
*/
app.use(function (req, res, next) {
    next(createError(404));
});

/*
error handler
*/
app.use(function (err, req, res, next) {
    // set locals
    // provide error only in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
