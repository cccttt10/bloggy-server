import { expect } from 'chai';
import request from 'supertest';

describe('/undefined-route', () => {
    const agent = request('http://localhost:3300');

    it('should return 404 if route is undefined', async () => {
        const res = await agent.get('/undefined-route');
        expect(res.status).to.equal(404);
    });
});
