/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import App from '../../src/App';
import { MESSAGES } from '../../src/util/constants';
import { TEST_SERVER_URL } from '../../src/util/constants';

describe('/deleteAllComments', () => {
    let app: App;
    let agent: SuperTest<Test>;

    before(() => {
        app = new App();
        app.start();
    });

    after(() => {
        app.stop();
    });

    beforeEach(() => {
        agent = request(TEST_SERVER_URL);
    });

    it('should delete all comments if sudo secret is provided', async () => {
        const res = await agent.post('/deleteAllComments').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);
    });

    it('should return 401 when attempting to delete all comments with wrong sudo secret', async () => {
        const res = await agent.post('/deleteAllComments').send({
            sudoSecret: process.env.SUDO_SECRET + 'wrong',
        });
        expect(res.text).to.equal(MESSAGES.SUDO_ACCESS_ONLY);
        expect(res.status).to.equal(401);
    });
});
