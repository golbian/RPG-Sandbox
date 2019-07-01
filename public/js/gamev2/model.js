angular.module('app').service('gamev2Model', function (connection) {
    this.duplicateGame = function (duplicateOptions) {
        const params = { id: duplicateOptions.game._id };

        return connection.get('/api/gamesv2/find-one', params).then(function (result) {
            const newGame = result.item;

            delete newGame._id;
            delete newGame.createdOn;
            newGame.gameName = duplicateOptions.newName;

            return connection.post('/api/gamesv2/create', newGame);
        });
    };
});
