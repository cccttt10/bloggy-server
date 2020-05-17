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

describe('/createCategory', () => {
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

    it('should create new categories for a user', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const cookie = registerRes.header['set-cookie'];
        {
            const newCategory: ICategory = { ...categories[0], user: userId };
            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie)
                .send(newCategory);
            expect(categoryRes.body).to.have.property('category');
            const returnedCategory = {
                name: categoryRes.body.category.name,
                description: categoryRes.body.category.description,
                user: categoryRes.body.category.user,
            };
            expect(returnedCategory).to.deep.equal(newCategory);
            expect(categoryRes.status).to.equal(201);
        }

        {
            const newCategory: ICategory = { ...categories[1], user: userId };
            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie)
                .send(newCategory);
            expect(categoryRes.body).to.have.property('category');
            const returnedCategory = {
                name: categoryRes.body.category.name,
                description: categoryRes.body.category.description,
                user: categoryRes.body.category.user,
            };
            expect(returnedCategory).to.deep.equal(newCategory);
            expect(categoryRes.status).to.equal(201);
        }
    });

    it('should return 401 if a user attempts to create a category without logging in', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];

        const newCategory: ICategory = { ...categories[0], user: userId };
        const categoryRes = await agent.post('/createCategory').send(newCategory);
        expect(categoryRes.body.message).to.equal(MESSAGES.NOT_LOGGED_IN);
        expect(categoryRes.status).to.equal(401);
    });

    it('should return 401 if a user attempts to create a category for someone else', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.body).to.have.property('user');
        expect(registerRes0.body.user).to.have.property('_id');
        expect(registerRes0.status).to.equal(201);

        const userId0 = registerRes0.body.user['_id'];
        const newCategory: ICategory = { ...categories[0], user: userId0 };

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);

        const cookie = registerRes1.header['set-cookie'];

        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.body.message).to.equal(MESSAGES.UNAUTHORIZED);
        expect(categoryRes.status).to.equal(401);
    });

    it('should return 400 when the same user attempts to create a duplicate category', async () => {
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
        expect(categoryRes.body).to.have.property('category');
        const returnedCategory = {
            name: categoryRes.body.category.name,
            description: categoryRes.body.category.description,
            user: categoryRes.body.category.user,
        };
        expect(returnedCategory).to.deep.equal(newCategory);
        expect(categoryRes.status).to.equal(201);

        const duplicateCategoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(duplicateCategoryRes.body.message).to.equal(
            MESSAGES.DUPLICATE_CATEGORY
        );
        expect(duplicateCategoryRes.status).to.equal(400);
    });

    it('should allow 2 different users to each have a category of the same name', async () => {
        {
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
            expect(categoryRes.body).to.have.property('category');
            const returnedCategory = {
                name: categoryRes.body.category.name,
                description: categoryRes.body.category.description,
                user: categoryRes.body.category.user,
            };
            expect(returnedCategory).to.deep.equal(newCategory);
            expect(categoryRes.status).to.equal(201);
        }
        {
            const registerRes = await agent.post('/register').send(users[1]);
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
            expect(categoryRes.body).to.have.property('category');
            const returnedCategory = {
                name: categoryRes.body.category.name,
                description: categoryRes.body.category.description,
                user: categoryRes.body.category.user,
            };
            expect(returnedCategory).to.deep.equal(newCategory);
            expect(categoryRes.status).to.equal(201);
        }
    });
});
