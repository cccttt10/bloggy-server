import { tryAsync } from '../../util/util';
import delAllUsers from './delAllUsers';
import getUser from './getUser';
// import currentUser from './currentUser';
// import delUser from './delUser';
// import getUserList from './getUserList';
import login from './login';
// import loginAdmin from './loginAdmin';
import logout from './logout';
import register from './register';

export default {
    // currentUser: tryAsync(currentUser),
    deleteAllUsers: tryAsync(delAllUsers),
    getUser: tryAsync(getUser),
    // delUser: tryAsync(delUser),
    // getUserList: tryAsync(getUserList),
    login: tryAsync(login),
    // loginAdmin: tryAsync(loginAdmin),
    logout: tryAsync(logout),
    register: tryAsync(register),
};
