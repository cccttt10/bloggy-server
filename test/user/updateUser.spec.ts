/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import App from '../../src/App';
import { MESSAGES } from '../../src/util/constants';
import { TEST_SERVER_URL } from '../../src/util/constants';
import { stdout } from '../../src/util/util';
import users from '../test-data/users';

describe('/updateUser', () => {
    let app: App;
    let agent: SuperTest<Test>;
    let cookie: string;

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

    beforeEach(async () => {
        agent = request(TEST_SERVER_URL);
        cleanup();

        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);
        cookie = registerRes.header['set-cookie'];
    });

    afterEach(cleanup);

    it('should update user if token is provided', async () => {
        const updateRes = await agent
            .post('/updateUser')
            .set('Cookie', cookie)
            .send({
                updatedFields: {
                    name: 'new name',
                    password: 'new password',
                    confirmPassword: 'new password',
                },
                debug: true,
            });
        expect(updateRes.status).to.equal(201);
        stdout.printResponse(updateRes);

        const _id = updateRes.body.user._id;
        const getRes = await agent.post('/getUser').send({ _id: _id });
        expect(getRes.body.user.name).to.equal('new name');
    });

    it('should return 400 if the user attempts to update email', async () => {
        const updateRes = await agent
            .post('/updateUser')
            .set('Cookie', cookie)
            .send({ updatedFields: { email: 'newemail@gmail.com' } });
        expect(updateRes.status).to.equal(400);
        expect(updateRes.text).to.equal(MESSAGES.EMAIL_CANNOT_CHANGE);
    });

    it('should return 400 if the user attempts to update password and password is shorter than 7 characters', async () => {
        const updateRes = await agent
            .post('/updateUser')
            .set('Cookie', cookie)
            .send({ updatedFields: { password: '123', confirmPassword: '123' } });
        expect(updateRes.status).to.equal(400);
        expect(updateRes.text).to.equal(MESSAGES.PASSWORD_TOO_SHORT);
    });

    it('should return 400 if the user attempts to update password but does not confirm password', async () => {
        const updateRes = await agent
            .post('/updateUser')
            .set('Cookie', cookie)
            .send({ updatedFields: { password: '1234567' } });
        expect(updateRes.status).to.equal(400);
        expect(updateRes.text).to.equal(MESSAGES.CONFIRM_PASSWORD_EMPTY);
    });

    it('should return 400 if the suer attempts to update password but password do not match', async () => {
        const updateRes = await agent
            .post('/updateUser')
            .set('Cookie', cookie)
            .send({
                updatedFields: { password: '1234567', confirmPassword: '1234566' },
            });
        expect(updateRes.status).to.equal(400);
        expect(updateRes.text).to.equal(MESSAGES.PASSWORDS_DO_NOT_MATCH);
    });

    it('should return 401 if no token is provided', async () => {
        const updateRes = await agent
            .post('/updateUser')
            .send({ updatedFields: { name: 'new name' } });
        expect(updateRes.status).to.equal(401);
        expect(updateRes.text).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
