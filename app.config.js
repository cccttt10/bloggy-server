const { argv } = require('yargs');

exports.MONGODB = {
    uri: `mongodb://127.0.0.1:${argv.dbPort || '27017'}/blogNode`,
    username: argv.dbUsername || 'DB_username',
    password: argv.dbPassword || 'DB_password',
};

exports.GITHUB = {
    username: 'chuntonggao',
    oauthUri: 'https://github.com/login/oauth/authorize',
    accessTokenUrl: 'https://github.com/login/oauth/access_token',

    /*
    url to get github user info
    eg: https://api.github.com/user?access_token=****&scope=&token_type=bearer
    */
    userUrl: 'https://api.github.com/user',

    /*
    production enrivonment
    TODO: replace "****" in redirectUrl, clientId and clientSecret with parameters in the OAuth App you create
    */
    // redirectUrl: 'http://biaochenxuying.cn/login',
    // clientId: '*****',
    // clientSecret: '*****',

    /*
    development environment
    parameters available for public use
    */
    redirectUrl: 'http://localhost:3001/login',
    clientId: '502176cec65773057a9e',
    clientSecret: '65d444de381a026301a2c7cffb6952b9a86ac235',
};
