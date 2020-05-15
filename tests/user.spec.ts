import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app';
import db from '../src/mongodb.config';

describe('user endpoints', () => {
    after(() => {
        db.disconnect();
    });

    it('should register a new user', async () => {
        const res = await request(app).post('/register').send({
            name: 'Chuntong Gao',
            password: 'chuntonggao',
            phone: '7788349708',
            email: 'heihegao@gmail.com',
            bio: 'Chuntong Gao is very handsome',
            type: 0,
        });
        expect(res.status).to.equal(200);
    });
});
