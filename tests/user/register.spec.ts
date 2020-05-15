/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request from 'supertest';

import { UserDocument } from '../../src/models/user';
import users from '../test-data/users';

describe('/register', () => {
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

    it('should return 400 if name is not provided', async () => {
        const res = await agent.post('/register').send({
            password: users[0].password,
            phone: users[0].phone,
            email: users[0].email,
            bio: users[0].bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if password is not provided', async () => {
        const res = await agent.post('/register').send({
            name: users[0].name,
            phone: users[0].phone,
            email: users[0].email,
            bio: users[0].bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email is not provided', async () => {
        const res = await agent.post('/register').send({
            name: users[0].name,
            password: users[0].password,
            phone: users[0].phone,
            bio: users[0].bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email is invalid format', async () => {
        const res = await agent.post('/register').send({
            name: users[0].name,
            password: users[0].password,
            phone: users[0].phone,
            email: 'heihegao@gmail',
            bio: users[0].bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should register a new user and give token upon registration', async () => {
        const res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.header).to.have.property('set-cookie');
        expect(res.status).to.equal(200);
    });

    it('should return 400 if email is already registered', async () => {
        let res = await agent.post('/register').send(users[0] as UserDocument);
        expect(res.header).to.have.property('set-cookie');
        expect(res.status).to.equal(200);

        res = await agent.post('/register').send({
            name: users[0].name + 'different name ',
            password: users[0].password + 'different password',
            phone: users[0].phone + 'different phone',
            email: users[0].email,
            bio: users[0].bio + 'different bio',
        } as UserDocument);
        expect(res.status).to.equal(400);
    });
});
