import { tryAsync } from '../../util/util';
import currentUser from './currentUser';
import delUser from './delUser';
import getUserList from './getUserList';
import login from './login';
import loginAdmin from './loginAdmin';
import loginOAuth from './loginOAuth';
import logout from './logout';
import register from './register';

export default {
    currentUser: tryAsync(currentUser),
    delUser: tryAsync(delUser),
    getUserList: tryAsync(getUserList),
    login: tryAsync(login),
    loginAdmin: tryAsync(loginAdmin),
    loginOAuth: tryAsync(loginOAuth),
    logout: tryAsync(logout),
    register: tryAsync(register),
};
