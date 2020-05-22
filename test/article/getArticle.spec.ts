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

describe('/getArticle', () => {
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

    it('should get an article', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const categoryRes0 = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(categories[0]);
        expect(categoryRes0.status).to.equal(201);
        const categoryId0 = categoryRes0.body.category._id;

        const categoryRes1 = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(categories[1]);
        expect(categoryRes1.status).to.equal(201);
        const categoryId1 = categoryRes1.body.category._id;

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send({
                ...articles[0],
                categories: [categoryId0, categoryId1],
            });
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        expect(articleRes.body.article).to.have.property('_id');
        const articleId = articleRes.body.article._id;

        const getRes = await agent
            .post('/getArticle')
            .send({ _id: articleId, debug: true });
        expect(getRes.status).to.equal(200);
        expect(getRes.body).to.have.property('article');
        expect(getRes.body.article).to.have.property('categories');
        expect(getRes.body.article.categories).to.be.array();
        expect(getRes.body.article.categories).to.be.ofSize(2);
        stdout.printResponse(getRes);
    });

    it('should increase view count by 1 if the request comes from a visitor', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        expect(articleRes.body.article).to.have.property('_id');
        const articleId = articleRes.body.article._id;
        expect(articleRes.body.article).to.have.property('meta');
        expect(articleRes.body.article.meta.numViews).to.equal(0);

        const getResVisitor = await agent
            .post('/getArticle')
            .send({ _id: articleId, isVisitor: true, debug: true });
        expect(getResVisitor.status).to.equal(200);
        expect(getResVisitor.body).to.have.property('article');
        expect(getResVisitor.body.article).to.have.property('meta');
        expect(getResVisitor.body.article.meta.numViews).to.equal(1);
        stdout.printResponse(getResVisitor);

        const getResNotVisitor = await agent
            .post('/getArticle')
            .send({ _id: articleId, isVisitor: false });
        expect(getResNotVisitor.status).to.equal(200);
        expect(getResNotVisitor.body).to.have.property('article');
        expect(getResNotVisitor.body.article).to.have.property('meta');
        expect(getResNotVisitor.body.article.meta.numViews).to.equal(1);
    });

    it('should return 400 if article id is not provided', async () => {
        const getRes = await agent.post('/getArticle').send();
        expect(getRes.status).to.equal(400);
        expect(getRes.body.message).to.equal(MESSAGES.ARTICLE_ID_NOT_PROVIDED);
    });

    it('should return 400 if article id does not exist in db', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        expect(articleRes.body.article).to.have.property('_id');
        const articleId = articleRes.body.article._id;

        const getRes0 = await agent.post('/getArticle').send({ _id: articleId });
        expect(getRes0.status).to.equal(200);

        const deleteRes = await agent
            .post('/deleteArticle')
            .set('Cookie', cookie)
            .send({ _id: articleId });
        expect(deleteRes.status).to.equal(204);
        const getRes1 = await agent.post('/getArticle').send({ _id: articleId });
        expect(getRes1.status).to.equal(400);
        expect(getRes1.body.message).to.equal(MESSAGES.ARTICLE_ID_NOT_FOUND);
        const getRes2 = await agent
            .post('/getArticle')
            .send({ _id: articleId + 'no such id' });
        expect(getRes2.status).to.equal(400);
        expect(getRes2.body.message).to.equal(MESSAGES.ARTICLE_ID_NOT_FOUND);
    });

    it('should return 401 if a visitor attempts to get a draft article', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send(articles[1]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        expect(articleRes.body.article).to.have.property('_id');
        const articleId = articleRes.body.article._id;

        const getResVisitor = await agent
            .post('/getArticle')
            .send({ _id: articleId, isVisitor: true });
        expect(getResVisitor.status).to.equal(401);
        expect(getResVisitor.body.message).to.equal(MESSAGES.UNAUTHORIZED);

        const getResNotVisitor = await agent
            .post('/getArticle')
            .send({ _id: articleId, isVisitor: false });
        expect(getResNotVisitor.status).to.equal(200);
    });
});
