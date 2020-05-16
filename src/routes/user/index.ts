import { tryAsync } from '../../util/util';
import delAllUsers from './delAllUsers';
import getUser from './getUser';
// import getUserList from './getUserList';
import login from './login';
import logout from './logout';
import register from './register';

export default {
    deleteAllUsers: tryAsync(delAllUsers),
    getUser: tryAsync(getUser),
    // getUserList: tryAsync(getUserList),
    login: tryAsync(login),
    logout: tryAsync(logout),
    register: tryAsync(register),
};
