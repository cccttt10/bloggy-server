/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import App from '../../src/App';
import { ICategory } from '../../src/models/category';
import { MESSAGES } from '../../src/util/constants';
import { TEST_SERVER_URL } from '../../src/util/constants';
import { stdout } from '../../src/util/util';
import articles from '../test-data/articles';
import categories from '../test-data/categories';
import users from '../test-data/users';

describe('/deleteCategory', () => {
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
    };

    beforeEach(() => {
        agent = request(TEST_SERVER_URL);
        cleanup();
    });

    afterEach(cleanup);

    it('should delete a category from a user', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = categories[0];
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);
        const categoryListResBefore = await agent
            .post('/getCategoryList')
            .send({ user: userId });
        expect(categoryListResBefore.status).to.equal(200);
        expect(categoryListResBefore.body).to.have.property('categoryList');
        expect(categoryListResBefore.body.categoryList).to.be.array();
        expect(categoryListResBefore.body.categoryList).to.be.ofSize(1);

        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie)
            .send({ name: categories[0].name, debug: true });
        expect(deleteRes.status).to.equal(204);
        stdout.printResponse(deleteRes);

        const categoryListResAfter = await agent
            .post('/getCategoryList')
            .send({ user: userId });
        expect(categoryListResAfter.status).to.equal(200);
        expect(categoryListResAfter.body).to.have.property('categoryList');
        expect(categoryListResAfter.body.categoryList).to.be.array();
        expect(categoryListResAfter.body.categoryList).to.be.ofSize(0);
    });

    it('should remove references to the delete category in corresponding articles', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const categoryRes0 = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(categories[0]);
        expect(categoryRes0.status).to.equal(201);
        const categoryId0 = categoryRes0.body.category._id;

        const articleRes0 = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send({
                ...articles[0],
                categories: [categoryId0],
            });
        expect(articleRes0.status).to.equal(201);
        expect(articleRes0.body.article.categories).to.be.ofSize(1);
        const articleId0 = articleRes0.body.article._id;

        const articleRes1 = await agent
            .post('/createArticle')
            .set('Cookie', cookie)
            .send({
                ...articles[2],
                categories: [categoryId0],
            });
        expect(articleRes1.status).to.equal(201);
        expect(articleRes1.body.article.categories).to.be.ofSize(1);
        const articleId1 = articleRes1.body.article._id;

        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie)
            .send({ name: categories[0].name });
        expect(deleteRes.status).to.equal(204);

        const getRes0 = await await agent
            .post('/getArticle')
            .send({ _id: articleId0 });
        expect(getRes0.status).to.equal(200);
        expect(getRes0.body.article.categories).to.be.ofSize(0);

        const getRes1 = await await agent
            .post('/getArticle')
            .send({ _id: articleId1 });
        expect(getRes1.status).to.equal(200);
        expect(getRes1.body.article.categories).to.be.ofSize(0);
    });

    it('should return 400 if category name is not provided', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = categories[0];
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie)
            .send({});
        expect(deleteRes.status).to.equal(400);
        expect(deleteRes.body.message).to.equal(MESSAGES.CATEGORY_NAME_NOT_PROVIDED);
    });

    it('should return 400 if the specified user does not have the specified category', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = categories[0];
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie)
            .send({ name: categories[0].name + 'no such cateogry' });
        expect(deleteRes.status).to.equal(400);
        expect(deleteRes.body.message).to.equal(MESSAGES.CATEGORY_NOT_FOUND);
    });

    it('should return 401 if someone attempts to delete a category without logging in', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = categories[0];
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteCategory')
            .send({ name: categories[0].name });
        expect(deleteRes.status).to.equal(401);
        expect(deleteRes.body.message).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
