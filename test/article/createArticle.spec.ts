/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import App from '../../src/App';
import { MESSAGES, TEST_SERVER_URL } from '../../src/util/constants';
import { stdout } from '../../src/util/util';
import articles from '../test-data/articles';
import categories from '../test-data/categories';
import users from '../test-data/users';

describe('/createArticle', () => {
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
        let res = await agent.post('/deleteAllUsers').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);

        res = await agent.post('/deleteAllCategories').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);

        res = await agent.post('/deleteAllArticles').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);
    };

    beforeEach(() => {
        agent = request(TEST_SERVER_URL);
        cleanup();
    });

    afterEach(cleanup);

    it('should allow a registered user to create an article', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const categoryRes0 = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(categories[0]);
        expect(categoryRes0.status).to.equal(201);
        const categoryId0 = categoryRes0.body._id;

        const categoryRes1 = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(categories[1]);
        expect(categoryRes1.status).to.equal(201);
        const categoryId1 = categoryRes1.body._id;

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send({
                ...articles[0],
                categories: [categoryId0, categoryId1],
                debug: true,
            });
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        stdout.printResponse(articleRes);
    });

    it('should return 401 if someone attempts to create an article without logging in', async () => {
        const articleRes = await agent.post('/createArticle').send(articles[0]);
        expect(articleRes.status).to.equal(401);
        expect(articleRes.body.message).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
