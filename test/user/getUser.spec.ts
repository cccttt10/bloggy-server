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

describe('/getUser', () => {
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

    it('should get user info if user id is provided and id exists in db', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(201);

        const user = res.body.user;

        res = await agent.post('/getUser').send({ _id: user._id, debug: true });
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.deep.equal(user);
        expect(res.body.user).to.not.have.property('password');
        expect(res.status).to.equal(200);
        stdout.printResponse(res);
    });

    it('should return 400 if user id is not provided', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(201);

        res = await agent.post('/getUser').send({});
        expect(res.text).to.equal(MESSAGES.USER_ID_NOT_PROVIDED);
        expect(res.status).to.equal(400);
    });

    it('should return 400 if user id does not exist in db', async () => {
        let res = await agent.post('/register').send(users[0]);
        expect(res.body).to.have.property('user');
        expect(res.status).to.equal(201);

        const user = res.body.user;

        res = await agent.post('/getUser').send({ _id: user._id + 'no such user' });
        expect(res.text).to.equal(MESSAGES.USER_ID_NOT_FOUND);
        expect(res.status).to.equal(400);
    });
});
