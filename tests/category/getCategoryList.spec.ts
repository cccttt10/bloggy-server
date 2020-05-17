/*
load environment variables
*/
require('dotenv').config();

import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
chai.use(assertArrays);
import request, { SuperTest, Test } from 'supertest';

import { ICategory } from '../../src/models/category';
import { MESSAGES } from '../../src/util/constants';
import categories from '../test-data/categories';
import users from '../test-data/users';

describe('/getCategoryList', () => {
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

    it('should get all categories from a user', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.body).to.have.property('user');
        expect(registerRes0.body.user).to.have.property('_id');
        expect(registerRes0.status).to.equal(201);

        const userId0 = registerRes0.body.user['_id'];
        const cookie0 = registerRes0.header['set-cookie'];

        {
            const newCategory: ICategory = { ...categories[0], user: userId0 };
            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie0)
                .send(newCategory);
            expect(categoryRes.status).to.equal(201);
        }

        {
            const newCategory: ICategory = { ...categories[1], user: userId0 };
            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie0)
                .send(newCategory);
            expect(categoryRes.status).to.equal(201);
        }

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.body).to.have.property('user');
        expect(registerRes1.body.user).to.have.property('_id');
        expect(registerRes1.status).to.equal(201);

        const userId1 = registerRes1.body.user['_id'];
        const cookie1 = registerRes1.header['set-cookie'];

        {
            const newCategory: ICategory = { ...categories[0], user: userId1 };
            const categoryRes = await agent
                .post('/createCategory')
                .set('Cookie', cookie1)
                .send(newCategory);
            expect(categoryRes.status).to.equal(201);
        }

        const categoryRes0 = await agent
            .post('/getCategoryList')
            .send({ user: userId0 });
        expect(categoryRes0.status).to.equal(200);
        expect(categoryRes0.body).to.have.property('categoryList');
        expect(categoryRes0.body.categoryList).to.be.array();
        expect(categoryRes0.body.categoryList).to.be.ofSize(2);

        const categoryRes1 = await agent
            .post('/getCategoryList')
            .send({ user: userId1 });
        expect(categoryRes1.status).to.equal(200);
        expect(categoryRes1.body).to.have.property('categoryList');
        expect(categoryRes1.body.categoryList).to.be.array();
        expect(categoryRes1.body.categoryList).to.be.ofSize(1);
    });

    it('should return 400 if user id is not provided', async () => {
        const registerRes = await agent.post('/register').send(users[1]);
        expect(registerRes.status).to.equal(201);

        const categoryRes = await agent.post('/getCategoryList').send({});
        expect(categoryRes.body.message).to.equal(MESSAGES.USER_ID_NOT_PROVIDED);
        expect(categoryRes.status).to.equal(400);
    });

    it('should return 400 if user id does not exist in db ', async () => {
        const registerRes = await agent.post('/register').send(users[1]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];

        const categoryRes = await agent
            .post('/getCategoryList')
            .send({ user: userId + 'no such user id' });
        expect(categoryRes.body.message).to.equal(MESSAGES.USER_ID_NOT_FOUND);
        expect(categoryRes.status).to.equal(400);
    });
});
