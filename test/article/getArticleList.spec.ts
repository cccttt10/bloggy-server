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
import users from '../test-data/users';

describe('/getArticleList', () => {
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

    it('should get all articles written by an author if requester is not visitor, but get only non-draft articles if requester is visitor', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.status).to.equal(201);
        const cookie0 = registerRes0.header['set-cookie'];
        const userId0 = registerRes0.body.user._id;

        const articleRes0 = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[0]);
        expect(articleRes0.status).to.equal(201);

        const articleRes1 = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[1]);
        expect(articleRes1.status).to.equal(201);

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);
        const cookie1 = registerRes1.header['set-cookie'];
        const userId1 = registerRes1.body.user._id;

        const articleRes2 = await agent
            .post('/createArticle')
            .set('Cookie', cookie1)
            .send(articles[0]);
        expect(articleRes2.status).to.equal(201);

        const getRes0 = await agent
            .post('/getArticleList')
            .send({ user: userId0, isVisitor: false, debug: true });
        expect(getRes0.status).to.equal(200);
        expect(getRes0.body).to.have.property('articleList');
        expect(getRes0.body).to.have.property('count');
        expect(getRes0.body.articleList).to.be.array();
        expect(getRes0.body.articleList).to.be.ofSize(2);
        expect(getRes0.body.count).to.equal(2);
        stdout.printResponse(getRes0);

        const getRes1 = await agent
            .post('/getArticleList')
            .send({ user: userId1, isVisitor: false });
        expect(getRes1.status).to.equal(200);
        expect(getRes1.body).to.have.property('articleList');
        expect(getRes1.body).to.have.property('count');
        expect(getRes1.body.articleList).to.be.array();
        expect(getRes1.body.articleList).to.be.ofSize(1);
        expect(getRes1.body.count).to.equal(1);

        const getResVisitor = await agent
            .post('/getArticleList')
            .send({ user: userId0, isVisitor: true });
        expect(getResVisitor.status).to.equal(200);
        expect(getResVisitor.body).to.have.property('articleList');
        expect(getResVisitor.body).to.have.property('count');
        expect(getResVisitor.body.articleList).to.be.array();
        expect(getResVisitor.body.articleList).to.be.ofSize(1);
        expect(getResVisitor.body.count).to.equal(1);
    });

    it('should return 400 if author id is not provided', async () => {
        const getRes = await agent.post('/getArticleList').send({});
        expect(getRes.status).to.equal(400);
        expect(getRes.body.message).to.equal(MESSAGES.USER_ID_NOT_PROVIDED);
    });

    it('should return 400 if author id does not exist', async () => {
        const getRes = await agent
            .post('/getArticleList')
            .send({ user: 'no such user' });
        expect(getRes.status).to.equal(400);
        expect(getRes.body.message).to.equal(MESSAGES.USER_ID_NOT_FOUND);
    });
});
