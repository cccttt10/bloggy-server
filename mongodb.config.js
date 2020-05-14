const CONFIG = require('../app.config.js');
const autoIncrement = require('mongoose-auto-increment');
const consola = require('consola');
const mongoose = require('mongoose');

/*
remove deprecation warnings
*/
mongoose.set('useFindAndModify', false);

/*
set up promise
*/
mongoose.Promise = global.Promise;

/*
export mongoose instance
*/
exports.mongoose = mongoose;

exports.connect = () => {
    // connect to db
    mongoose.connect(CONFIG.MONGODB.uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        promiseLibrary: global.Promise,
    });

    // connection failed
    mongoose.connection.on('error', error => {
        consola.warn('db connection failed!', error);
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
