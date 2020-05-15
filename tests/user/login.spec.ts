/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request from 'supertest';

import { UserDocument } from '../../src/models/user';

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
        let res = await agent.post('/register').send({
            name: 'Chuntong Gao',
            password: 'chuntonggao',
            phone: '7788349708',
            email: 'heihegao@gmail.com',
            bio: 'Chuntong Gao is very handsome',
        } as UserDocument);
        expect(res.header).to.have.property('set-cookie');
        expect(res.status).to.equal(200);

        res = await agent.post('/login').send({
            email: 'heihegao@gmail.com',
            password: 'chuntonggao',
        });
        expect(res.header).to.have.property('set-cookie');
        expect(res.status).to.equal(200);
    });

    it('should return 400 if email exists but password is wrong', async () => {
        let res = await agent.post('/register').send({
            name: 'Chuntong Gao',
            password: 'chuntonggao',
            phone: '7788349708',
            email: 'heihegao@gmail.com',
            bio: 'Chuntong Gao is very handsome',
        } as UserDocument);
        expect(res.header).to.have.property('set-cookie');
        expect(res.status).to.equal(200);

        res = await agent.post('/login').send({
            email: 'heihegao@gmail.com',
            password: 'wrong',
        });
        expect(res.status).to.equal(400);
    });
});
