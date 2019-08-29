angular.module('app').service('gamev2Model', function ($q, connection, FileSaver) {

  this.getGameDefinition = function (id, isLinked) {
      const url = '/api/gamesv2/get/' + id;
      const params = { id: id, mode: 'edit', linked: isLinked };

      return connection.get(url, params).then(function (data) {
          return data.item;
      });
  };

  this.saveAsGame = function (game, mode) {

      // Cleaning up the map object
      // var clonedMap = clone(map);
      var clonedGame = game;

      let url;
      if (mode === 'add') {
          url = '/api/gamesv2/create';
      } if (mode === 'edit') {
          url = '/api/gamesv2/update/' + game._id;
      }

      console.log(clonedGame);

      return connection.post(url, clonedGame);
  };


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
