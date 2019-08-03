module.exports = function (app) {
    var token = require('./controller.js');

    /* Tokens */
    app.get('/api/token/find-all', restrict, token.TokensFindAll);
    app.get('/api/token/find-one', restrict, token.TokensFindOne);
    app.post('/api/token/create', restrict, token.TokensCreate);
    app.post('/api/token/update/:id', restrict, token.TokensUpdate);
    app.post('/api/token/delete/:id', restrict, token.TokensDelete);
    app.get('/api/token/get-token-data/:id', restrict, token.TokensGetData);
};
