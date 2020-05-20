import consola from 'consola';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

import { MESSAGES } from './constants';

export const MD5_SUFFIX = 'chuntonggao*&^%$#';

export const md5 = (pwd: crypto.BinaryLike): string => {
    const md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
};

// format as 2018-12-12 12:12:00
export const timestampToTime = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    const Y = date.getFullYear() + '-';
    const M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-';
    const D =
        date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    const h =
        date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    const m =
        date.getMinutes() < 10
            ? '0' + date.getMinutes() + ':'
            : date.getMinutes() + ':';
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
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
                res.status(err.statusCode).send({ message: err.message });
            } else {
                consola.error(err);
                res.status(500).send({
                    message: MESSAGES.UNEXPECTED_ERROR,
                });
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
    error: (message: string): void => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG === 'debug'
        ) {
            consola.error(message);
        }
    },
    info: (message: string): void => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG === 'debug'
        ) {
            consola.info(message);
        }
    },
    log: (message: string): void => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG === 'debug'
        ) {
            consola.log(message);
        }
    },
    ready: (message: string): void => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG === 'debug'
        ) {
            consola.ready(message);
        }
    },
    success: (message: string): void => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG === 'debug'
        ) {
            consola.success(message);
        }
    },
    warn: (message: string): void => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG === 'debug'
        ) {
            consola.warn(message);
        }
    },
};
