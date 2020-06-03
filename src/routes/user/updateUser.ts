import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { User, UserDocument } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { md5, MD5_SUFFIX, ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { updatedFields } = req.body;

    if (updatedFields.email) {
        throw new ServerError({
            message: MESSAGES.EMAIL_CANNOT_CHANGE,
            statusCode: 400,
        });
    }

    if (updatedFields.password) {
        const { password, confirmPassword } = updatedFields;
        if (password.length < 7) {
            throw new ServerError({
                message: MESSAGES.PASSWORD_TOO_SHORT,
                statusCode: 400,
            });
        }
        if (!confirmPassword) {
            throw new ServerError({
                message: MESSAGES.CONFIRM_PASSWORD_EMPTY,
                statusCode: 400,
            });
        }

        if (password !== confirmPassword) {
            throw new ServerError({
                message: MESSAGES.PASSWORDS_DO_NOT_MATCH,
                statusCode: 400,
            });
        }
        updatedFields.password = md5(updatedFields.password + MD5_SUFFIX);
    }

    const newUser: UserDocument = await User.findOneAndUpdate(
        { _id: req.verifiedUser._id },
        { ...updatedFields, updatedOn: Date.now() },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(201).json({ user: newUser });
};
