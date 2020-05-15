import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app';
import { User } from '../src/models/user';
import db from '../src/mongodb.config';

describe('user endpoints', () => {
    const requestObj = request(app);

    before(async () => {
        await User.deleteMany({});
    });

    after(async () => {
        await User.deleteMany({});
        db.disconnect();
    });

    describe('/register', () => {
        it('should register a new user with status 200 and cod 0', async () => {
            const res = await requestObj.post('/register').send({
                name: 'Chuntong Gao',
                password: 'chuntonggao',
                phone: '7788349708',
                email: 'heihegao@gmail.com',
                bio: 'Chuntong Gao is very handsome',
                type: 0,
            });
            expect(res.status).to.equal(200);
            expect(res.body.code).to.equal(0);
        });

        it('should return status 200 and code 1 if email is already used', async () => {
            const res = await request(app).post('/register').send({
                name: '77 Xiong',
                password: '52771314',
                phone: '123',
                email: 'heihegao@gmail.com',
                bio: '77 is best',
                type: 0,
            });
            expect(res.status).to.equal(200);
            expect(res.body.code).to.equal(1);
        });
    });
});
