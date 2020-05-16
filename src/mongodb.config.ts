import consola from 'consola';
import mongoose, { Mongoose } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import * as CONFIG from './app.config.js';

/*
remove deprecation warnings
*/
mongoose.set('useFindAndModify', false);

/*
set up promise
*/
mongoose.Promise = global.Promise;

const connect = (): Mongoose => {
    // connect to db
    mongoose.connect(CONFIG.MONGODB.uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        promiseLibrary: global.Promise,
        useUnifiedTopology: true,
    });

    // connection failed
    mongoose.connection.on('error', err => {
        consola.error('db connection failed!');
        consola.log(err);
    });

    // connection successful
    mongoose.connection.once('open', () => {
        consola.ready('db connection successful!');
    });

    // initialize auto-incrementing id
    autoIncrement.initialize(mongoose.connection);

    // return mongoose instance
    return mongoose;
};

export const disconnect = (): void => {
    mongoose.disconnect();
};

export default {
    instance: mongoose,
    connect: connect,
    disconnect: disconnect,
};
