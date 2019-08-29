module.exports = function (app) {
    var Games = require('./controller.js');

    /* Games */
    app.get('/api/games/find-all', restrict, Games.GamesFindAll);
    app.get('/api/games/find-one', restrict, Games.GamesFindOne);
    app.post('/api/games/create', restrict, Games.GamesCreate);
    app.post('/api/games/update/:id', restrict, Games.GamesUpdate);
    app.post('/api/games/delete/:id', restrict, Games.GamesDelete);
    app.get('/api/games/get/:id', restrict, Games.getGame);
    app.post('/api/games/publish-game', restrict, Games.PublishGame);
    app.post('/api/games/unpublish', restrict, Games.UnpublishGame);
    app.post('/api/games/share-game', restrict, Games.ShareGame);
    app.post('/api/games/unshare', restrict, Games.UnshareGame);
};
