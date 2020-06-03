import { tryAsync } from '../../util/util';
import deleteAllUsers from './deleteAllUsers';
import getCurrentUser from './getCurrentUser';
import getUser from './getUser';
import login from './login';
import logout from './logout';
import register from './register';
import updateUser from './updateUser';

export default {
    deleteAllUsers: tryAsync(deleteAllUsers),
    getCurrentUser: tryAsync(getCurrentUser),
    getUser: tryAsync(getUser),
    login: tryAsync(login),
    logout: tryAsync(logout),
    register: tryAsync(register),
    updateUser: tryAsync(updateUser),
};
