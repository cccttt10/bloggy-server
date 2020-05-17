import { tryAsync } from '../../util/util';
import createCategory from './createCategory';
import deleteAllCategories from './deleteAllCategories';
import deleteCategory from './deleteCategory';
import getCategoryList from './getCategoryList';

export default {
    createCategory: tryAsync(createCategory),
    deleteAllCategories: tryAsync(deleteAllCategories),
    deleteCategory: tryAsync(deleteCategory),
    getCategoryList: tryAsync(getCategoryList),
};
