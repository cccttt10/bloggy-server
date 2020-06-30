/*
load environment variables
*/
require('dotenv').config();

import App from './App';

new App(process.env.PORT).start();
