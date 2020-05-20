/*
load environment variables
*/
require('dotenv').config();

export const MESSAGES = {
    ARTICLE_ID_NOT_PROVIDED: 'Please provide article id.',
    ARTICLE_ID_NOT_FOUND: 'Article id does not exist.',
    CATEGORY_NAME_NOT_PROVIDED: 'Please provide a category name',
    CATEGORY_NOT_FOUND: 'This user does not have this category.',
    DUPLICATE_CATEGORY: 'This user already has this category.',
    DUPLICATE_EMAIL: 'User already exists. Email is already used.',
    EMPTY_EMAIL: 'Email cannot be empty.',
    EMPTY_NAME: 'Name cannot be empty',
    EMPTY_PASSWORD: 'Password cannot be empty',
    INVALID_EMAIL: 'Email has invalid format',
    NOT_LOGGED_IN: 'You are not logged in. Please log in to complete this action.',
    NO_USER_FOR_THIS_TOKEN: 'The user corresponding to this token no longer exists.',
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
