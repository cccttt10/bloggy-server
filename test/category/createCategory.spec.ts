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
import categories from '../test-data/categories';
import users from '../test-data/users';

describe('/createCategory', () => {
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

    it('should create new categories for a user', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];
        {
            const newCategory: ICategory = categories[0];
            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie)
                .send(newCategory);
            expect(categoryRes.body).to.have.property('category');
            expect(categoryRes.body.category.name).to.equal(newCategory.name);
            expect(categoryRes.body.category.description).to.equal(
                newCategory.description
            );
            expect(categoryRes.status).to.equal(201);
        }

        {
            const newCategory: ICategory = categories[1];
            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie)
                .send(newCategory);
            expect(categoryRes.body).to.have.property('category');
            expect(categoryRes.body.category.name).to.equal(newCategory.name);
            expect(categoryRes.body.category.description).to.equal(
                newCategory.description
            );
            expect(categoryRes.status).to.equal(201);
        }
    });

    it('should return 401 if a user attempts to create a category without logging in', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const newCategory: ICategory = categories[0];
        const categoryRes = await agent.post('/createCategory').send(newCategory);
        expect(categoryRes.body.message).to.equal(MESSAGES.NOT_LOGGED_IN);
        expect(categoryRes.status).to.equal(401);
    });

    it('should return 400 when the same user attempts to create a duplicate category', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.status).to.equal(201);

        const cookie = registerRes.header['set-cookie'];
        const newCategory: ICategory = categories[0];

        const categoryRes = await agent
            .post('/createCategory')
            .set('Cookie', cookie)
            .send(newCategory);
        expect(categoryRes.body).to.have.property('category');
        expect(categoryRes.body.category.name).to.equal(newCategory.name);
        expect(categoryRes.body.category.description).to.equal(
            newCategory.description
        );
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
            expect(registerRes.status).to.equal(201);

            const cookie = registerRes.header['set-cookie'];
            const newCategory: ICategory = categories[0];

            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie)
                .send(newCategory);
            expect(categoryRes.body).to.have.property('category');
            expect(categoryRes.body.category.name).to.equal(newCategory.name);
            expect(categoryRes.body.category.description).to.equal(
                newCategory.description
            );
            expect(categoryRes.status).to.equal(201);
        }
        {
            const registerRes = await agent.post('/register').send(users[1]);
            expect(registerRes.status).to.equal(201);

            const cookie = registerRes.header['set-cookie'];
            const newCategory: ICategory = categories[0];

            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie)
                .send(newCategory);
            expect(categoryRes.body).to.have.property('category');
            expect(categoryRes.body.category.name).to.equal(newCategory.name);
            expect(categoryRes.body.category.description).to.equal(
                newCategory.description
            );
            expect(categoryRes.status).to.equal(201);
        }
    });
});
