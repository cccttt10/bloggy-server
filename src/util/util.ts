import colors from 'colors';
import consola from 'consola';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import request from 'supertest';

import { MESSAGES } from './constants';

export const MD5_SUFFIX = 'chuntonggao*&^%$#';

export const md5 = (pwd: crypto.BinaryLike): string => {
    const md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
};

export class ServerError extends Error {
    constructor({ message, statusCode }: { message: string; statusCode: number }) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
    statusCode: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunc = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type WrappedFunc = (req: Request, res: Response, next: NextFunction) => void;
export const tryAsync = (asyncFn: AsyncFunc): WrappedFunc => {
    return (req: Request, res: Response, next: NextFunction): void => {
        asyncFn(req, res, next).catch(err => {
            if (err instanceof ServerError) {
                res.status(err.statusCode).send(err.message);
            } else {
                consola.error(err);
                res.status(500).send(MESSAGES.UNEXPECTED_ERROR);
            }
        });
    };
};

/*
normalize port into number, string or false
*/
export const normalizePort = (val: number | string): number | string | false => {
    const port = parseInt(val as string, 10);

    if (isNaN(port)) {
        // named pipe
        return val as string;
    }

    if (port >= 0) {
        // port number
        return port as number;
    }

    return false;
};

export const stdout = {
    error: (message: string, debug = false): void => {
        if (process.env.NODE_ENV === 'development' || debug) {
            consola.error(message);
        }
    },
    info: (message: string, debug = false): void => {
        if (process.env.NODE_ENV === 'development' || debug) {
            consola.info(message);
        }
    },
    log: (message: string, debug = false): void => {
        if (process.env.NODE_ENV === 'development' || debug) {
            consola.log(message);
        }
    },
    ready: (message: string, debug = false): void => {
        if (process.env.NODE_ENV === 'development' || debug) {
            consola.ready(message);
        }
    },
    success: (message: string, debug = false): void => {
        if (process.env.NODE_ENV === 'development' || debug) {
            consola.success(message);
        }
    },
    warn: (message: string, debug = false): void => {
        if (process.env.NODE_ENV === 'development' || debug) {
            consola.warn(message);
        }
    },

    printIncomingRequest: (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        if (req.body.debug === true) {
            // eslint-disable-next-line no-console
            console.log(colors.cyan(`Request method: ${req.method}`));
            // eslint-disable-next-line no-console
            console.log(colors.cyan('Request header: '));
            // eslint-disable-next-line no-console
            console.log(colors.cyan(JSON.stringify(req.headers, undefined, 4)));
            // eslint-disable-next-line no-console
            console.log(colors.cyan('Request body: '));
            // eslint-disable-next-line no-console
            console.log(colors.cyan(JSON.stringify(req.body, undefined, 4)));
            // eslint-disable-next-line no-console
            console.log(colors.cyan('Request cookies:'));
            // eslint-disable-next-line no-console
            console.log(colors.cyan(JSON.stringify(req.cookies, undefined, 4)));
        }
        next();
    },

    printResponse: (res: request.Response): void => {
        // eslint-disable-next-line no-console
        console.log(colors.green(`Response status: ${res.status}`));
        // eslint-disable-next-line no-console
        console.log(colors.green('Response header:'));
        // eslint-disable-next-line no-console
        console.log(colors.green(JSON.stringify(res.header, undefined, 4)));
        // eslint-disable-next-line no-console
        console.log(colors.green('Response body: '));
        // eslint-disable-next-line no-console
        console.log(colors.green(JSON.stringify(res.body, undefined, 4)));
    },
};
