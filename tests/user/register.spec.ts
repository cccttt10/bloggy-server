import { expect } from 'chai';
import request from 'supertest';

import app from '../../src/app';
import { User, UserDocument } from '../../src/models/user';
import db from '../../src/mongodb.config';

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
        it('should register a new user', async () => {
            const res = await requestObj.post('/register').send({
                name: 'Chuntong Gao',
                password: 'chuntonggao',
                phone: '7788349708',
                email: 'heihegao@gmail.com',
                bio: 'Chuntong Gao is very handsome',
            } as UserDocument);
            expect(res.status).to.equal(200);
        });

        it('should return 400 if email is already registered', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    name: 'Kiko Xiong',
                    password: '52771314',
                    phone: '123',
                    email: 'heihegao@gmail.com',
                    bio: '77 is best',
                } as UserDocument);
            expect(res.status).to.equal(400);
        });
    });
});
