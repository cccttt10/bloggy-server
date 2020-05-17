/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import { ICategory } from '../../src/models/category';
import { MESSAGES } from '../../src/util/constants';
import categories from '../test-data/categories';
import users from '../test-data/users';

describe('/deleteCategory', () => {
    let agent: SuperTest<Test>;

    const cleanup = async (): Promise<void> => {
        let res = await agent.post('/deleteAllUsers').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(202);

        res = await agent.post('/deleteAllCategories').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(202);
    };

    beforeEach(() => {
        agent = request('http://localhost:3300');
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

        const newCategory: ICategory = { ...categories[0], user: userId };
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
            .send({ name: categories[0].name, user: userId });
        expect(deleteRes.status).to.equal(202);
        const categoryListResAfter = await agent
            .post('/getCategoryList')
            .send({ user: userId });
        expect(categoryListResAfter.status).to.equal(200);
        expect(categoryListResAfter.body).to.have.property('categoryList');
        expect(categoryListResAfter.body.categoryList).to.be.array();
        expect(categoryListResAfter.body.categoryList).to.be.ofSize(0);
    });

    it('should return 401 if a user attempts to delete a category from someone else', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.body).to.have.property('user');
        expect(registerRes0.body.user).to.have.property('_id');
        expect(registerRes0.status).to.equal(201);

        const userId0 = registerRes0.body.user['_id'];
        const cookie0 = registerRes0.header['set-cookie'];
        const newCategory: ICategory = { ...categories[0], user: userId0 };

        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie0)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);

        const cookie1 = registerRes1.header['set-cookie'];
        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie1)
            .send({ name: categories[0].name, user: userId0 });
        expect(deleteRes.body.message).to.equal(MESSAGES.UNAUTHORIZED);
        expect(deleteRes.status).to.equal(401);
    });

    it('should return 400 if user id is not provided', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = { ...categories[0], user: userId };
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie)
            .send({ name: categories[0].name });
        expect(deleteRes.status).to.equal(400);
        expect(deleteRes.body.message).to.equal(MESSAGES.USER_ID_NOT_PROVIDED);
    });

    it('should return 400 if category name is not provided', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = { ...categories[0], user: userId };
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie)
            .send({ user: userId });
        expect(deleteRes.status).to.equal(400);
        expect(deleteRes.body.message).to.equal(MESSAGES.CATEGORY_NAME_NOT_PROVIDED);
    });

    it('should return 400 if the specified user does not have the specified category', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = { ...categories[0], user: userId };
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteCategory')
            .set('Cookie', cookie)
            .send({ name: categories[0].name + 'no such cateogry', user: userId });
        expect(deleteRes.status).to.equal(400);
        expect(deleteRes.body.message).to.equal(MESSAGES.CATEGORY_NOT_FOUND);
    });

    it('should return 401 if someone attempts to delete a category without logging in', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const cookie = registerRes.header['set-cookie'];

        const newCategory: ICategory = { ...categories[0], user: userId };
        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.status).to.equal(201);

        const deleteRes = await agent
            .post('/deleteCategory')
            .send({ name: categories[0].name, user: userId });
        expect(deleteRes.status).to.equal(401);
        expect(deleteRes.body.message).to.equal(MESSAGES.NOT_LOGGED_IN);
    });
});
