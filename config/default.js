module.exports = {
    url: 'http://localhost:3306/',
    ip: '0.0.0.0',
    port: 8080,
    db_type: ' MariaDB', // tingoDB or mongoDB

    // MongoDB connection string
    // See https://docs.mongodb.com/manual/reference/connection-string/
    db: 'RPG-Sandbox',

    sql_db: true,

    google: {
        clientID: 'your client id',
        clientSecret: 'your client secret',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback',
    },
    pagination: {
        itemsPerPage: 10,
    },
    query: {
        defaultRecordsPerPage: 500,
    },
};
