import { tryAsync } from '../../util/util';
import deleteAllUsers from './deleteAllUsers';
import getUser from './getUser';
import login from './login';
import logout from './logout';
import register from './register';

export default {
    deleteAllUsers: tryAsync(deleteAllUsers),
    getUser: tryAsync(getUser),
    login: tryAsync(login),
    logout: tryAsync(logout),
    register: tryAsync(register),
};
