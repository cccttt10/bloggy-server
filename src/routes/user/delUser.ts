// import consola from 'consola';
// import { Request, Response } from 'express';

// import { User } from '../../models/user';
// import { respondToClient } from '../../util/util';

// export default (req: Request, res: Response): void => {
//     const { id } = req.body;
//     User.deleteMany({ _id: id })
//         .then(result => {
//             if (result.n === 1) {
//                 respondToClient(res, 200, 0, 'User successfully deleted.');
//             } else {
//                 respondToClient(res, 200, 1, 'User does not exist.');
//             }
//         })
//         .catch(err => {
//             consola.error(err);
//             respondToClient(res);
//         });
// };
