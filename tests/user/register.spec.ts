/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request from 'supertest';

import { UserDocument } from '../../src/models/user';
import { chuntongUser } from '../test-data/users';

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
            password: chuntongUser.password,
            phone: chuntongUser.phone,
            email: chuntongUser.email,
            bio: chuntongUser.bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if password is not provided', async () => {
        const res = await agent.post('/register').send({
            name: chuntongUser.name,
            phone: chuntongUser.phone,
            email: chuntongUser.email,
            bio: chuntongUser.bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email is not provided', async () => {
        const res = await agent.post('/register').send({
            name: chuntongUser.name,
            password: chuntongUser.password,
            phone: chuntongUser.phone,
            bio: chuntongUser.bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email is invalid format', async () => {
        const res = await agent.post('/register').send({
            name: chuntongUser.name,
            password: chuntongUser.password,
            phone: chuntongUser.phone,
            email: 'heihegao@gmail',
            bio: chuntongUser.bio,
        } as UserDocument);
        expect(res.status).to.equal(400);
    });

    it('should register a new user and give token upon registration', async () => {
        const res = await agent.post('/register').send(chuntongUser as UserDocument);
        expect(res.header).to.have.property('set-cookie');
        expect(res.status).to.equal(200);
    });

    it('should return 400 if email is already registered', async () => {
        let res = await agent.post('/register').send(chuntongUser as UserDocument);
        expect(res.header).to.have.property('set-cookie');
        expect(res.status).to.equal(200);

        res = await agent.post('/register').send({
            name: 'Kiko Xiong',
            password: '52771314',
            phone: '123',
            email: chuntongUser.email,
            bio: '77 is best',
        } as UserDocument);
        expect(res.status).to.equal(400);
    });
});
