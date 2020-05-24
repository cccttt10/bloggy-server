/*
load environment variables
*/
require('dotenv').config();

import { expect } from 'chai';
import request, { SuperTest, Test } from 'supertest';

import App from '../../src/App';
import { MESSAGES } from '../../src/util/constants';
import { TEST_SERVER_URL } from '../../src/util/constants';
import { stdout } from '../../src/util/util';
import articles from '../test-data/articles';
import comments from '../test-data/comments';
import users from '../test-data/users';

describe('/approveComment', () => {
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

        res = await agent.post('/deleteAllArticles').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);

        res = await agent.post('/deleteAllComments').send({
            sudoSecret: process.env.SUDO_SECRET,
        });
        expect(res.status).to.equal(204);
    };

    beforeEach(() => {
        agent = request(TEST_SERVER_URL);
        cleanup();
    });

    afterEach(cleanup);

    it('should allow the author of an article to approve comments', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.status).to.equal(201);

        const cookie0 = registerRes0.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);

        const cookie1 = registerRes1.header['set-cookie'];

        const commentRes = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes.status).to.equal(201);
        expect(commentRes.body).to.have.property('comment');
        expect(commentRes.body.comment.content).to.equal(comments[0]);
        expect(commentRes.body.comment.isApproved).to.equal(false);
        const commentId = commentRes.body.comment._id;

        const approveRes = await agent
            .post('/approveComment')
            .set('Cookie', cookie0)
            .send({ commentId: commentId, debug: true });
        expect(approveRes.status).to.equal(200);
        expect(approveRes.body).to.have.property('comment');
        expect(approveRes.body.comment.isApproved).to.equal(true);
        stdout.printResponse(approveRes);
    });

    it('should return 400 if comment id is not provided', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.status).to.equal(201);

        const cookie0 = registerRes0.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);

        const cookie1 = registerRes1.header['set-cookie'];

        const commentRes = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes.status).to.equal(201);
        expect(commentRes.body).to.have.property('comment');
        expect(commentRes.body.comment.content).to.equal(comments[0]);
        expect(commentRes.body.comment.isApproved).to.equal(false);

        const approveRes = await agent
            .post('/approveComment')
            .set('Cookie', cookie0)
            .send({});
        expect(approveRes.status).to.equal(400);
        expect(approveRes.text).to.equal(MESSAGES.COMMENT_ID_NOT_PROVIDED);
    });

    it('should return 400 if comment id does not exist', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.status).to.equal(201);

        const cookie0 = registerRes0.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);

        const cookie1 = registerRes1.header['set-cookie'];

        const commentRes = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes.status).to.equal(201);
        expect(commentRes.body).to.have.property('comment');
        expect(commentRes.body.comment.content).to.equal(comments[0]);
        expect(commentRes.body.comment.isApproved).to.equal(false);
        const commentId = commentRes.body.comment._id;

        const approveRes = await agent
            .post('/approveComment')
            .set('Cookie', cookie0)
            .send({ commentId: commentId + 'no such comment' });
        expect(approveRes.status).to.equal(400);
        expect(approveRes.text).to.equal(MESSAGES.COMMENT_ID_NOT_FOUND);
    });

    it('should return 401 if the requester is not logged in', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.status).to.equal(201);

        const cookie0 = registerRes0.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);

        const cookie1 = registerRes1.header['set-cookie'];

        const commentRes = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes.status).to.equal(201);
        expect(commentRes.body).to.have.property('comment');
        expect(commentRes.body.comment.content).to.equal(comments[0]);
        expect(commentRes.body.comment.isApproved).to.equal(false);
        const commentId = commentRes.body.comment._id;

        const approveRes = await agent
            .post('/approveComment')
            .send({ commentId: commentId });
        expect(approveRes.status).to.equal(401);
        expect(approveRes.text).to.equal(MESSAGES.NOT_LOGGED_IN);
    });

    it('should return 401 if the requester is not the author of the commented article', async () => {
        const registerRes0 = await agent.post('/register').send(users[0]);
        expect(registerRes0.status).to.equal(201);

        const cookie0 = registerRes0.header['set-cookie'];

        const articleRes = await agent
            .post('/createArticle')
            .set('Cookie', cookie0)
            .send(articles[0]);
        expect(articleRes.status).to.equal(201);
        expect(articleRes.body).to.have.property('article');
        const articleId = articleRes.body.article._id;

        const registerRes1 = await agent.post('/register').send(users[1]);
        expect(registerRes1.status).to.equal(201);

        const cookie1 = registerRes1.header['set-cookie'];

        const commentRes = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes.status).to.equal(201);
        expect(commentRes.body).to.have.property('comment');
        expect(commentRes.body.comment.content).to.equal(comments[0]);
        expect(commentRes.body.comment.isApproved).to.equal(false);
        const commentId = commentRes.body.comment._id;

        const approveRes = await agent
            .post('/approveComment')
            .set('Cookie', cookie1)
            .send({ commentId: commentId });
        expect(approveRes.status).to.equal(401);
        expect(approveRes.text).to.equal(MESSAGES.UNAUTHORIZED);
    });
});
