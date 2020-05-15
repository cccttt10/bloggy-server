// import { Request, Response } from 'express';

// import { respondToClient } from '../../util/util';

// export default (req: Request, res: Response): void => {
//     if (req.session.userInfo) {
//         req.session.userInfo = null; // delete session
//         respondToClient(res, 200, 0, 'Logout successful.');
//     } else {
//         respondToClient(res, 200, 1, 'You have not logged out yet.');
//     }
// };
