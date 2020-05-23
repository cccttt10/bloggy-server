import { Request } from 'express';

import { UserDocument } from '../models/user';

declare module 'global' {
    export type AugmentedRequest = Request & { verifiedUser?: UserDocument };
}
