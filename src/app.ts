/*
babel is needed in order to support import syntax
*/
require('babel-register');

/*
dependencies
*/
import consola from 'consola';
import cookieParser from 'cookie-parser';
import { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import session from 'express-session';
import { ExpressError } from 'global';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';

const app: Express = express();

/*
configure view engine
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
connect to db
*/
import db from './mongodb.config';
db.connect();

/*
configure routes
*/
import setUpRoutes from './routes/index';
setUpRoutes(app);

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
    consola.error('error caught in app.ts');
    consola.log(err);

    // set locals
    // provide error only in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
