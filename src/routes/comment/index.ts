import { tryAsync } from '../../util/util';
import approveComment from './approveComment';
import createComment from './createComment';
import deleteAllComments from './deleteAllComments';
import deleteComment from './deleteComment';
import getCommentList from './getCommentList';

export default {
    approveComment: tryAsync(approveComment),
    createComment: tryAsync(createComment),
    deleteAllComments: tryAsync(deleteAllComments),
    deleteComment: tryAsync(deleteComment),
    getCommentList: tryAsync(getCommentList),
};
