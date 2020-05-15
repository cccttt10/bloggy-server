// import consola from 'consola';
// import { Request, Response } from 'express';

// import { User } from '../../models/user';
// import { md5, MD5_SUFFIX, respondToClient } from '../../util/util';

// export default (req: Request, res: Response): void => {
//     const { email, password } = req.body;

//     if (!email) {
//         respondToClient(res, 400, 2, 'Email cannot be empty.');
//         return;
//     }

//     if (!password) {
//         respondToClient(res, 400, 2, 'Password cannot be empty.');
//         return;
//     }

//     User.findOne({
//         email,
//         password: md5(password + MD5_SUFFIX),
//     })
//         .then(userInfo => {
//             if (userInfo) {
//                 // if (userInfo.type === 0) {
//                 //     // provision session if login successful
//                 //     req.session.userInfo = userInfo;
//                 //     respondToClient(res, 200, 0, 'Login successful', userInfo);
//                 // } else {
//                 //     respondToClient(
//                 //         res,
//                 //         403,
//                 //         1,
//                 //         'Only blog owners can access this page.'
//                 //     );
//                 // }
//                 req.session.userInfo = userInfo;
//                 respondToClient(res, 200, 0, 'Login successful', userInfo);
//             } else {
//                 respondToClient(res, 400, 1, 'Email or password is worng.');
//             }
//         })
//         .catch(err => {
//             consola.error(err);
//             respondToClient(res);
//         });
// };
