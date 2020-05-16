/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import setCookie from 'set-cookie-parser';
import request from 'supertest';

describe('/logout', () => {
    const agent = request('http://localhost:3300');

    it('should log out', async () => {
        const res = await agent.get('/logout');
        expect(res.header).to.have.property('set-cookie');
        const cookie = setCookie.parse(res.header['set-cookie'], {
            map: true,
        });
        expect(cookie.jwt.value).to.equal('');
        expect(res.status).to.equal(200);
    });
});
