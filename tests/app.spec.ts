import { expect } from 'chai';
import request from 'supertest';

describe('environment', () => {
    it('should run in test environment', () => {
        expect(process.env.NODE_ENV === 'test');
    });
});

describe('/undefined-route', () => {
    it('should return 404 if route is undefined', async () => {
        const agent = request('http://localhost:3300');
        const res = await agent.get('/undefined-route');
        expect(res.status).to.equal(404);
    });
});
