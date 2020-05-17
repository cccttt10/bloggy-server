/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import { MESSAGES } from '../../src/util/constants';
import users from '../test-data/users';

describe('/getUser', () => {
    let agent: SuperTest<Test>;

    const cleanup = async (): Promise<void> => {
        const res = await agent.post('/deleteAllUsers').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(202);
    };

    beforeEach(() => {
        agent = request('http://localhost:3300');
        cleanup();
    });

    afterEach(cleanup);

    it('should get user info if user id is provided and id exists in db', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(201);

        const user = res.body.user;

        res = await agent.post('/getUser').send({ id: user.id });
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.deep.equal(user);
        expect(res.body.user).to.not.have.property('password');
        expect(res.status).to.equal(200);
    });

    it('should return 400 if user id is not provided', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(201);

        res = await agent.post('/getUser').send({});
        expect(res.body.message).to.equal(MESSAGES.USER_ID_NOT_PROVIDED);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if user id does not exist in db', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(201);

        const user = res.body.user;

        res = await agent.post('/getUser').send({ id: user.id * 10 });
        expect(res.body.message).to.equal(MESSAGES.USER_ID_NOT_FOUND);
        expect(res.status).to.equal(400);
    });
});
