import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import http from 'http';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';

import db from './mongodb.config';
import setUpRoutes from './routes/index';
import { DEFAULT_PORT } from './util/constants';
import { normalizePort, stdout } from './util/util';

export default class App {
    private readonly port: number;
    private readonly app: Express = express();
    private server: http.Server;

    constructor(port?: number | string) {
        this.port = normalizePort(port || DEFAULT_PORT) as number;
    }

    start(): void {
        /*
        use logger
        */
        if (process.env.NODE_ENV !== 'test') {
            this.app.use(logger('dev'));
        }

        /*
        configure cross origin
        */
        // const handleOptionsRequest = (
        //     req: Request,
        //     res: Response,
        //     next: NextFunction
        // ): void => {
        //     if (req.method === 'OPTIONS') {
        //         console.log('here options');
        //         res.header('Access-Control-Allow-Origin', '你的项目地址，用*将会带来安全问题');
        //         res.header('Access-Control-Allow-Headers', '*');
        //         res.header('Access-Control-Allow-Methods', '*');
        //         res.header('Access-Control-Allow-Credentials', true);
        //         res.header('Content-Type', 'application/json;charset=utf-8');
        //         console.log(res.header);
        //         res.end();
        //     }
        //     else next();
        // };
        // this.app.use(handleOptionsRequest);
        this.app.use(cors({ credentials: true, origin: '"http://localhost:8000"' })); // Allow cross origin access

        /*
        configure express
        */
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, 'public')));

        /*
        configure cookie
        */
        this.app.use(cookieParser());

        /*
        print out request details if debug flag is enabled
        */
        this.app.use(stdout.printIncomingRequest);

        /*
        connect to db
        */
        db.connect();
        require('./models/article');
        require('./models/category');
        require('./models/comment');
        require('./models/user');

        /*
        configure routes
        */
        setUpRoutes(this.app);

        /*
        catch 404 and forward to error handler
        */
        this.app.use(function (req: Request, res: Response, next: NextFunction) {
            next(createError(404));
        });

        /*
        error handler
        */
        this.app.use(function (
            err: Error & { status?: number },
            req: Request,
            res: Response,
            next: NextFunction
        ) {
            stdout.error('error caught in app.ts');
            stdout.log(err.toString());

            // set locals
            // provide error only in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            res.status(err.status || 500).send({
                message: 'Unexpected server error.',
            });
        });

        this.server = this.app.listen(this.port, () => {
            stdout.success(`App running on port ${this.port}...`);
        });
    }

    stop(): void {
        this.server.close(() => {
            stdout.info('Server will stop.');
        });
    }
}
