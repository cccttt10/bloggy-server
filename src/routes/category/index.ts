import { tryAsync } from '../../util/util';
import createCategory from './createCategory';
import deleteAllCategories from './deleteAllCategories';

export default {
    createCategory: tryAsync(createCategory),
    deleteAllCategories: tryAsync(deleteAllCategories),
};
