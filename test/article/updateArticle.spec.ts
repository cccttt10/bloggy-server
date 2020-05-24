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

describe('/updateArticle', () => {
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

    it("should an article's author to update the article", async () => {
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
                categories: [categoryId0],
            });
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const updateRes0 = await agent
            .post('/updateArticle')
            .set('Cookie', cookie)
            .send({
                _id: articleId,
                updatedFields: {
                    title: 'updated title',
                    categories: [categoryId0, categoryId1],
                },
                debug: true,
            });
        expect(updateRes0.status).to.equal(200);
        expect(updateRes0.body).to.have.property('article');
        expect(updateRes0.body.article.title).to.equal('updated title');
        expect(updateRes0.body.article.categories).to.be.ofSize(2);
        stdout.printResponse(updateRes0);
    });

    it('should return 400 if article id is not provided', async () => {
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
                categories: [categoryId0],
            });
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');

        const updateRes0 = await agent
            .post('/updateArticle')
            .set('Cookie', cookie)
            .send({
                updatedFields: {
                    title: 'updated title',
                    categories: [categoryId0, categoryId1],
                },
            });
        expect(updateRes0.status).to.equal(400);
        expect(updateRes0.text).to.equal(MESSAGES.ARTICLE_ID_NOT_PROVIDED);
    });

    it('should return 400 if article id does not exist', async () => {
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
                categories: [categoryId0],
            });
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const updateRes0 = await agent
            .post('/updateArticle')
            .set('Cookie', cookie)
            .send({
                _id: articleId + 'no such article id',
                updatedFields: {
                    title: 'updated title',
                    categories: [categoryId0, categoryId1],
                },
            });
        expect(updateRes0.status).to.equal(400);
        expect(updateRes0.text).to.equal(MESSAGES.ARTICLE_ID_NOT_FOUND);
    });

    it('should return 401 if someone attempts to update an article without logging in', async () => {
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
                categories: [categoryId0],
            });
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const updateRes0 = await agent.post('/updateArticle').send({
            _id: articleId,
            updatedFields: {
                title: 'updated title',
                categories: [categoryId0, categoryId1],
            },
        });
        expect(updateRes0.status).to.equal(401);
        expect(updateRes0.text).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
