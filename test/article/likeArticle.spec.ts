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

describe('/likeArticle', () => {
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

    it('should allow a logged in user to like an article', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.status).to.equal(201);
        const cookie0 = registerRes0.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;
        expect(articleRes.body.article).to.have.property('meta');
        expect(articleRes.body.article.meta.numLikes).to.equal(0);

        const likeRes0 = await agent
            .post('/likeArticle')
            .set('Cookie', cookie0)
            .send({ _id: articleId, debug: true });
        expect(likeRes0.status).to.equal(200);
        expect(likeRes0.body).to.have.property('article');
        stdout.printResponse(likeRes0);
        expect(likeRes0.body.article).to.have.property('meta');
        expect(likeRes0.body.article.meta.numLikes).to.equal(1);
        stdout.printResponse(likeRes0);

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);
        const cookie1 = registerRes1.header['set-cookie'];

        const likeRes1 = await agent
            .post('/likeArticle')
            .set('Cookie', cookie1)
            .send({ _id: articleId });
        expect(likeRes1.status).to.equal(200);
        expect(likeRes1.body).to.have.property('article');
        expect(likeRes1.body.article).to.have.property('meta');
        expect(likeRes1.body.article.meta.numLikes).to.equal(2);
    });

    it('should return 400 if a user attempts to like an article twice', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);
        const cookie = registerRes.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;
        expect(articleRes.body.article).to.have.property('meta');
        expect(articleRes.body.article.meta.numLikes).to.equal(0);

        const likeRes0 = await agent
            .post('/likeArticle')
            .set('Cookie', cookie)
            .send({ _id: articleId });
        expect(likeRes0.status).to.equal(200);
        expect(likeRes0.body).to.have.property('article');
        expect(likeRes0.body.article).to.have.property('meta');
        expect(likeRes0.body.article.meta.numLikes).to.equal(1);

        const likeRes1 = await agent
            .post('/likeArticle')
            .set('Cookie', cookie)
            .send({ _id: articleId });
        expect(likeRes1.status).to.equal(400);
        expect(likeRes1.text).to.equal(MESSAGES.ALREADY_LIKED);

        const getRes = await agent.post('/getArticle').send({ _id: articleId });
        expect(getRes.status).to.equal(200);
        expect(getRes.body).to.have.property('article');
        expect(getRes.body.article).to.have.property('meta');
        expect(getRes.body.article.meta.numLikes).equal(1);
    });

    it('should return 400 if article id is not provided', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);
        const cookie = registerRes.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);

        const likeRes = await agent
            .post('/likeArticle')
            .set('Cookie', cookie)
            .send({});
        expect(likeRes.status).to.equal(400);
        expect(likeRes.text).to.equal(MESSAGES.ARTICLE_ID_NOT_PROVIDED);
    });

    it('should return 400 if article id does not exist', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);
        const cookie = registerRes.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;
        expect(articleRes.body.article).to.have.property('meta');
        expect(articleRes.body.article.meta.numLikes).to.equal(0);

        const likeRes = await agent
            .post('/likeArticle')
            .set('Cookie', cookie)
            .send({ _id: articleId + 'no such article' });
        expect(likeRes.status).to.equal(400);
        expect(likeRes.text).to.equal(MESSAGES.ARTICLE_ID_NOT_FOUND);
    });

    it('should return 401 if a user attempts to like an article without logging in', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);
        const cookie = registerRes.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;
        expect(articleRes.body.article).to.have.property('meta');
        expect(articleRes.body.article.meta.numLikes).to.equal(0);

        const likeRes = await agent.post('/likeArticle').send({ _id: articleId });
        expect(likeRes.status).to.equal(401);
        expect(likeRes.text).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
