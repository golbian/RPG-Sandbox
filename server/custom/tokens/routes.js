module.exports = function (app) {
    var Token = require('./controller.js');

    /* Tokens */
    app.get('/api/token/find-all', restrict, Token.TokensFindAll);
    app.get('/api/token/find-one', restrict, Token.TokensFindOne);
    app.post('/api/token/create', restrict, Token.TokensCreate);
    app.post('/api/token/update/:id', restrict, Token.TokensUpdate);
    app.post('/api/token/delete/:id', restrict, Token.TokensDelete);
    app.get('/api/token/get-token/:id', Token.GetToken);
    app.get('/api/token/get-token-data/:id', restrict, Token.TokensGetData);
};
