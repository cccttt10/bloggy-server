/*
load environment variables
*/
require('dotenv').config();

export const MESSAGES = {
    ABOUT_PAGE_ALREADY_EXISTS:
        'There is already an about page, you can only have one.',
    ALREADY_LIKED: 'You already liked this article.',
    ARTICLE_ID_NOT_FOUND: 'Article id does not exist.',
    ARTICLE_ID_NOT_PROVIDED: 'Please provide article id.',
    CATEGORY_NAME_NOT_PROVIDED: 'Please provide a category name',
    CATEGORY_NOT_FOUND: 'This user does not have this category.',
    COMMENT_ID_NOT_FOUND: 'Comment id does not exist',
    COMMENT_ID_NOT_PROVIDED: 'Please provide comment id',
    CONFIRM_PASSWORD_EMPTY: 'Please confirm your password.',
    DUPLICATE_CATEGORY: 'This user already has this category.',
    DUPLICATE_EMAIL: 'User already exists. Email is already used.',
    EMAIL_CANNOT_CHANGE: 'You cannot change your email address',
    EMPTY_COMMENT: 'Comment cannot be empty.',
    EMPTY_EMAIL: 'Email cannot be empty.',
    EMPTY_NAME: 'Name cannot be empty',
    EMPTY_PASSWORD: 'Password cannot be empty',
    INVALID_EMAIL: 'Email has invalid format',
    NO_USER_FOR_THIS_TOKEN: 'The user corresponding to this token no longer exists.',
    NOT_LOGGED_IN: 'You are not logged in. Please log in to complete this action.',
    PASSWORD_TOO_SHORT: 'Password must be 7 characters or longer.',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
    SUDO_ACCESS_ONLY: 'You need sudo privilege to access this route.',
    UNAUTHORIZED: 'You are not authorized to complete this action.',
    UNEXPECTED_ERROR: 'Unexpected error',
    USER_ID_NOT_FOUND: 'User id does not exist.',
    USER_ID_NOT_PROVIDED: 'Please provide user id.',
    WRONG_CREDENTIALS: 'Email or password is wrong.',
};

export const MONGODB = {
    uri: `mongodb+srv://chuntonggao:${process.env.DB_PASSWORD}@cluster0-i4fbo.mongodb.net/test?retryWrites=true&w=majority`,
};

export const TEST_SERVER_URL = 'http://localhost:3300';

export const DEFAULT_PORT = 3300;

// https://s1.ax1x.com/2020/05/15/YDzq7d.jpg
export const DEFAULT_IMG_URL = 'https://s1.ax1x.com/2020/08/05/a61HVs.png';
