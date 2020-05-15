module.exports = {
    './src/**/*.js': [
        'prettier --config ./.prettierrc.json --check', 
        'eslint --no-error-on-unmatched-pattern'
    ],
    './src/**/*.ts': [
        'prettier --config ./.prettierrc.json --check', 
        'eslint --no-error-on-unmatched-pattern'
    ],
    './tests/**/*.js': [
        'prettier --config ./.prettierrc.json --check', 
        'eslint --no-error-on-unmatched-pattern'
    ],
    './tests/**/*.ts': [
        'prettier --config ./.prettierrc.json --check', 
        'eslint --no-error-on-unmatched-pattern'
    ]
};