/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request from 'supertest';

import { ICategory } from '../../src/models/category';
import categories from '../test-data/categories';
import users from '../test-data/users';

describe('/createCategory', () => {
    const agent = request('http://localhost:3300');

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

    beforeEach(cleanup);

    afterEach(cleanup);

    it('should create a new category for a user', async () => {
        const registerRes = await agent.post('/register').send(users[0]);
        expect(registerRes.body).to.have.property('user');
        expect(registerRes.body.user).to.have.property('_id');
        expect(registerRes.status).to.equal(201);

        const userId = registerRes.body.user['_id'];
        const newCategory: ICategory = { ...categories[0], user: userId };

        const categoryRes = await agent.post('/createCategory').send(newCategory);
        expect(categoryRes.body).to.have.property('category');
        const returnedCategory = {
            name: categoryRes.body.category.name,
            description: categoryRes.body.category.description,
            user: categoryRes.body.category.user,
        };
        expect(returnedCategory).to.deep.equal(newCategory);
        expect(categoryRes.status).to.equal(201);
    });
});
