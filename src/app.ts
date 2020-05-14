/*
babel is needed in order to support import syntax
*/
require('babel-register');

/*
dependencies
*/
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import express from 'express';
import session from 'express-session';
import { ExpressError } from 'global';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';

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
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createError(404));
});

/*
error handler
*/
app.use(function (
    err: ExpressError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // set locals
    // provide error only in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
