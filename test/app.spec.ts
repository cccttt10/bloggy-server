import { expect } from 'chai';
import request from 'supertest';

import App from '../src/App';
import { TEST_SERVER_URL } from '../src/util/constants';

describe('basic app settings', () => {
    let app: App;

    before(() => {
        app = new App();
        app.start();
    });

    after(() => {
        app.stop();
    });

    it('should run in test environment', () => {
        expect(process.env.NODE_ENV === 'test');
    });

    it('should return 404 if route is undefined', async () => {
        const agent = request(TEST_SERVER_URL);
        const res = await agent.get('/undefined-route');
        expect(res.status).to.equal(404);
    });
});
