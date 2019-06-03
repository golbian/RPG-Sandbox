module.exports = function (app) {
    var Gamesv2 = require('./controller.js');

    /* Reports */
    app.get('/api/gamesv2/find-all', restrict, Gamesv2.Gamesv2FindAll);
    app.get('/api/gamesv2/find-one', restrict, Gamesv2.Gamesv2FindOne);
    app.post('/api/gamesv2/create', restrict, Gamesv2.Gamesv2Create);
    app.post('/api/gamesv2/duplicate', restrict, Gamesv2.Gamesv2Duplicate);
    app.post('/api/gamesv2/update/:id', restrict, Gamesv2.Gamesv2Update);
    app.post('/api/gamesv2/delete/:id', restrict, Gamesv2.Gamesv2Delete);
    app.get('/api/gamesv2/get/:id', Gamesv2.getGame);
    app.post('/api/gamesv2/publish-page', restrict, Gamesv2.PublishGame);
    app.post('/api/gamesv2/unpublish', restrict, Gamesv2.UnpublishGame);
    app.post('/api/gamesv2/share-page', restrict, Gamesv2.ShareGame);
    app.post('/api/gamesv2/unshare', restrict, Gamesv2.UnshareGame);
};
