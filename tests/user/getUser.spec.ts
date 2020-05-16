/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request from 'supertest';

import { UserDocument } from '../../src/models/user';
import users from '../test-data/users';

describe('/getUser', () => {
    const agent = request('http://localhost:3300');

    beforeEach(async () => {
        const res = await agent.post('/deleteAllUsers').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(202);
    });

    afterEach(async () => {
        const res = await agent
            .post('/deleteAllUsers')
            .send({ sudoSecret: process.env.SUDO_SECRET });
        expect(res.status).to.equal(202);
    });

    it('should get user info if user id is provided and id exists in db', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(200);

        const user = res.body.user;

        res = await agent.post('/getUser').send({ id: user.id });
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.deep.equal(user);
        expect(res.status).to.equal(200);
    });

    it('should return 400 if user id is not provided', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(200);

        res = await agent.post('/getUser').send({});
        expect(res.status).to.equal(400);
    });

    it('should return 400 if user id does not exist in db', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(200);

        const user = res.body.user;

        res = await agent.post('/getUser').send({ id: user.id * 10 });
        expect(res.status).to.equal(400);
    });
});
