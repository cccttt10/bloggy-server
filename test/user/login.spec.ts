/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import setCookie from 'set-cookie-parser';
import request, { SuperTest, Test } from 'supertest';

import App from '../../src/App';
import { MESSAGES } from '../../src/util/constants';
import { TEST_SERVER_URL } from '../../src/util/constants';
import { stdout } from '../../src/util/util';
import users from '../test-data/users';

describe('/login', () => {
    let app: App;
    let agent: SuperTest<Test>;

    before(() => {
        app = new App();
        app.start();
    });

    after(() => {
        app.stop();
    });

    const cleanup = async (): Promise<void> => {
        const res = await agent.post('/deleteAllUsers').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);
    };

    beforeEach(() => {
        agent = request(TEST_SERVER_URL);
        cleanup();
    });

    afterEach(cleanup);

    it('should allow a registered user to login', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.status).to.equal(201);

        res = await agent.post('/login').send({
            email: users[0].email,
            password: users[0].password,
            debug: true,
        });
        expect(res.header).to.have.property('set-cookie');
        const cookie = setCookie.parse(res.header['set-cookie'], {
            map: true,
        });
        expect(cookie.jwt.value).to.not.equal('');
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.not.have.property('password');
        expect(res.status).to.equal(200);
        stdout.printResponse(res);
    });

    it('should return 400 if email exists but password is wrong', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.status).to.equal(201);

        res = await agent.post('/login').send({
            email: users[0].email,
            password: users[0].password + 'wrong',
        });
        expect(res.body.message).to.equal(MESSAGES.WRONG_CREDENTIALS);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email does not exist', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.status).to.equal(201);

        res = await agent.post('/login').send({
            email: users[0].email + 'does not exist',
            password: users[0].password,
        });
        expect(res.body.message).to.equal(MESSAGES.WRONG_CREDENTIALS);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if email is not provided', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.status).to.equal(201);

        res = await agent.post('/login').send({
            password: users[0].password,
        });
        expect(res.body.message).to.equal(MESSAGES.EMPTY_EMAIL);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if password is not provided', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.status).to.equal(201);

        res = await agent.post('/login').send({
            email: users[0].email,
        });
        expect(res.body.message).to.equal(MESSAGES.EMPTY_PASSWORD);
        expect(res.status).to.equal(400);
    });
});
