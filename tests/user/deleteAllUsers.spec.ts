/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import { MESSAGES } from '../../src/util/constants';

describe('/deleteAllUsers', () => {
    let agent: SuperTest<Test>;

    beforeEach(() => {
        agent = request('http://localhost:3300');
    });

    it('should delete all users if sudo secret is provided', async () => {
        const res = await agent.post('/deleteAllUsers').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);
    });

    it('should return 401 when attempting to delete all users with wrong sudo secret', async () => {
        const res = await agent.post('/deleteAllUsers').send({
            sudoSecret: process.env.SUDO_SECRET + 'wrong',
        });
        expect(res.body.message).to.equal(MESSAGES.SUDO_ACCESS_ONLY);
        expect(res.status).to.equal(401);
    });
});
