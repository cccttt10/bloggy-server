/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import App from '../../src/App';
import { IArticle } from '../../src/models/article';
import { MESSAGES, TEST_SERVER_URL } from '../../src/util/constants';
import { stdout } from '../../src/util/util';
import articles from '../test-data/articles';
import users from '../test-data/users';

describe('/deleteArticle', () => {
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

    it('should delete an article from a user', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const cookie = registerRes.header['set-cookie'];

        const newArticle: IArticle = articles[0];
        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(newArticle);
        expect(articleRes.body).to.have.property('article');
        expect(articleRes.body.article).to.have.property('_id');
        const articleId = articleRes.body.article['_id'];
        expect(articleRes.status).to.equal(201);

        const articleListResBefore = await agent
            .post('/getArticleList')
            .send({ user: userId });
        expect(articleListResBefore.status).to.equal(200);
        expect(articleListResBefore.body).to.have.property('articleList');
        expect(articleListResBefore.body.articleList).to.be.array();
        expect(articleListResBefore.body.articleList).to.be.ofSize(1);
        expect(articleListResBefore.body).to.have.property('count');
        expect(articleListResBefore.body.count).to.equal(1);

        const deleteRes = await agent
            .post('/deleteArticle')
            .set('Cookie', cookie)
            .send({ _id: articleId, debug: true });
        expect(deleteRes.status).to.equal(204);
        stdout.printResponse(deleteRes);

        const articleListResAfter = await agent
            .post('/getArticleList')
            .send({ user: userId });
        expect(articleListResAfter.status).to.equal(200);
        expect(articleListResAfter.body).to.have.property('articleList');
        expect(articleListResAfter.body.articleList).to.be.array();
        expect(articleListResAfter.body.articleList).to.be.ofSize(0);
        expect(articleListResAfter.body).to.have.property('count');
        expect(articleListResAfter.body.count).to.equal(0);
    });

    it('should return 400 if article id is not provided', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const newArticle: IArticle = articles[0];
        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(newArticle);
        expect(articleRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteArticle')
            .set('Cookie', cookie)
            .send({});
        expect(deleteRes.status).to.equal(400);
        expect(deleteRes.body.message).to.equal(MESSAGES.ARTICLE_ID_NOT_PROVIDED);
    });

    it('should return 400 if the specified user does not have the specified article', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const newArticle: IArticle = articles[0];
        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(newArticle);
        expect(articleRes.body).to.have.property('article');
        expect(articleRes.body.article).to.have.property('_id');
        const articleId = articleRes.body.article['_id'];
        expect(articleRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteArticle')
            .set('Cookie', cookie)
            .send({ _id: articleId + 'no such article' });
        expect(deleteRes.status).to.equal(400);
        expect(deleteRes.body.message).to.equal(MESSAGES.ARTICLE_ID_NOT_FOUND);
    });

    it('should return 401 if someone attempts to delete a category without logging in', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const newArticle: IArticle = articles[0];
        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(newArticle);
        expect(articleRes.body).to.have.property('article');
        expect(articleRes.body.article).to.have.property('_id');
        const articleId = articleRes.body.article['_id'];
        expect(articleRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteArticle')
            .send({ _id: articleId });
        expect(deleteRes.status).to.equal(401);
        expect(deleteRes.body.message).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
