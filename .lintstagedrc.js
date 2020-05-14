module.exports = {
    './**/*.js': [
        'prettier --config ./.prettierrc.json --write',
        'eslint --fix'
    ]
};