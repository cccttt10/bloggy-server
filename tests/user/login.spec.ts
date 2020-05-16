/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import setCookie from 'set-cookie-parser';
import request from 'supertest';

import { UserDocument } from '../../src/models/user';
import users from '../test-data/users';

describe('/login', () => {
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

    it('should allow a registered user to login', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.status).to.equal(200);

        res = await agent.post('/login').send({
            email: users[0].email,
            password: users[0].password,
        });
        expect(res.header).to.have.property('set-cookie');
        const cookie = setCookie.parse(res.header['set-cookie'], {
            map: true,
        });
        expect(cookie.jwt.value).to.not.equal('');
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(200);
    });

    it('should return 400 if email exists but password is wrong', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.status).to.equal(200);

        res = await agent.post('/login').send({
            email: users[0].email,
            password: users[0].password + 'wrong',
        });
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email does not exist', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.status).to.equal(200);

        res = await agent.post('/login').send({
            email: users[0].email + 'does not exist',
            password: users[0].password,
        });
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email is not provided', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.status).to.equal(200);

        res = await agent.post('/login').send({
            password: users[0].password,
        });
        expect(res.status).to.equal(400);
    });

    it('should return 400 if password is not provided', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.status).to.equal(200);

        res = await agent.post('/login').send({
            email: users[0].email,
        });
        expect(res.status).to.equal(400);
    });
});
