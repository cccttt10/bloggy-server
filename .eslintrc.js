// prettier-ignore
module.exports = {
    'env': {
        'es6': true,
        'node': true
    },
    'extends': ['eslint:recommended'],
    'parserOptions': {
        'ecmaVersion': 9,
        'sourceType': 'module'
    },
    'plugins': ['require-sort'],
    'rules': {
        'camelcase': 'error',
        'eqeqeq': 'error',
        'max-lines': ['warn', 200],
        'no-console': 'warn',
        'no-trailing-spaces': 'error',
        'no-unused-vars': 'error',
        'require-await': 'error',
        "require-sort/require-sort": "error"
    }
};