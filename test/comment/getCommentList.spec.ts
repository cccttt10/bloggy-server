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

describe('/getCommentList', () => {
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

    it('should get all comments of an article if requester is not visitor', async () => {
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

        const commentRes0 = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes0.status).to.equal(201);

        const commentRes1 = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes1.status).to.equal(201);

        const commentListRes = await agent
            .post('/getCommentList')
            .send({ articleId: articleId, isVisitor: false, debug: true });
        expect(commentListRes.status).to.equal(200);
        expect(commentListRes.body).to.have.property('count');
        expect(commentListRes.body.count).to.equal(2);
        expect(commentListRes.body).to.have.property('commentList');
        expect(commentListRes.body.commentList).to.be.array();
        expect(commentListRes.body.commentList).to.be.ofSize(2);
        stdout.printResponse(commentListRes);
    });

    it('should get only approved comments of an article if requester is visitor', async () => {
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

        const commentRes0 = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes0.status).to.equal(201);
        const commentId0 = commentRes0.body.comment._id;

        const commentRes1 = await agent
            .post('/createComment')
            .set('Cookie', cookie1)
            .send({ articleId: articleId, content: comments[0] });
        expect(commentRes1.status).to.equal(201);

        const commentListRes0 = await agent
            .post('/getCommentList')
            .send({ articleId: articleId, isVisitor: true });
        expect(commentListRes0.status).to.equal(200);
        expect(commentListRes0.body).to.have.property('count');
        expect(commentListRes0.body.count).to.equal(0);
        expect(commentListRes0.body).to.have.property('commentList');
        expect(commentListRes0.body.commentList).to.be.array();
        expect(commentListRes0.body.commentList).to.be.ofSize(0);

        const approveRes = await agent
            .post('/approveComment')
            .set('Cookie', cookie0)
            .send({ commentId: commentId0 });
        expect(approveRes.status).to.equal(200);

        const commentListRes1 = await agent
            .post('/getCommentList')
            .send({ articleId: articleId, isVisitor: true });
        expect(commentListRes1.status).to.equal(200);
        expect(commentListRes1.body).to.have.property('count');
        expect(commentListRes1.body.count).to.equal(1);
        expect(commentListRes1.body).to.have.property('commentList');
        expect(commentListRes1.body.commentList).to.be.array();
        expect(commentListRes1.body.commentList).to.be.ofSize(1);
    });

    it('should return 400 if article id is not provided', async () => {
        const commentListRes = await agent.post('/getCommentList').send({});
        expect(commentListRes.status).to.equal(400);
        expect(commentListRes.text).to.equal(MESSAGES.ARTICLE_ID_NOT_PROVIDED);
    });

    it('should return 400 if article id does nto exist', async () => {
        const commentListRes = await agent
            .post('/getCommentList')
            .send({ articleId: 'no such article' });
        expect(commentListRes.status).to.equal(400);
        expect(commentListRes.text).to.equal(MESSAGES.ARTICLE_ID_NOT_FOUND);
    });
});
