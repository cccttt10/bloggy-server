module.exports = {
    './src/**/*.js': [
        'prettier --config ./.prettierrc.json --check', 
        'eslint'
    ],
    './src/**/*.ts': [
        'prettier --config ./.prettierrc.json --check', 
        'eslint',
    ]
};