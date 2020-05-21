/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import setCookie from 'set-cookie-parser';
import request from 'supertest';

import App from '../../src/App';
import { TEST_SERVER_URL } from '../../src/util/constants';
import { stdout } from '../../src/util/util';

describe('/logout', () => {
    it('should log out', async () => {
        const app: App = new App();
        app.start();
        const agent = request(TEST_SERVER_URL);
        const res = await agent.get('/logout');
        expect(res.header).to.have.property('set-cookie');
        const cookie = setCookie.parse(res.header['set-cookie'], {
            map: true,
        });
        expect(cookie.jwt.value).to.equal('');
        expect(res.status).to.equal(200);
        stdout.printResponse(res);
        app.stop();
    });
});
