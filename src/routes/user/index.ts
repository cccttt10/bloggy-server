import { tryAsync } from '../../util/util';
import delAllUsers from './delAllUsers';
import getUser from './getUser';
import login from './login';
import logout from './logout';
import register from './register';

export default {
    deleteAllUsers: tryAsync(delAllUsers),
    getUser: tryAsync(getUser),
    login: tryAsync(login),
    logout: tryAsync(logout),
    register: tryAsync(register),
};
