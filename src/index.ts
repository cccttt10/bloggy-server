/*
load environment variables
*/
require('dotenv').config();

import consola from 'consola';

import app from './app';

/*
normalize port into number, string or false
*/
const normalizePort = (val: number | string): number | string | false => {
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

const port = normalizePort(process.env.PORT || 3300);

app.listen(port, () => {
    consola.success(`App running on port ${port}...`);
});
