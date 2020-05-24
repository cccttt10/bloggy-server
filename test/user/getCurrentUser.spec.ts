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

describe('/getCurrentUser', () => {
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

    it('should get currently logged in user via token', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];
        expect(registerRes.body).to.have.property('user');
        const userId = registerRes.body.user._id;

        const getRes = await agent.get('/getCurrentUser').set('Cookie', cookie);
        expect(getRes.status).to.equal(200);
        expect(getRes.body).to.have.property('user');
        expect(getRes.body.user._id).to.equal(userId);
        stdout.printResponse(getRes);
    });

    it('should return 401 if token is not provided', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const getRes = await agent.get('/getCurrentUser');
        expect(getRes.status).to.equal(401);
        expect(getRes.text).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
