  angular.module('app.games').controller('GamesViewController', GamesViewController);

    GamesViewController.$inject = ['$scope', 'connection', 'gamev2Model', '$timeout', '$compile', 'game'];

    function GamesViewController ($scope, connection, gamev2Model, $timeout, $compile, game) {

        const vm = this;
        $scope.mode = 'edit';
        vm.prompts = {};
        vm.game = game;
        $scope.selectedGame = vm.game;
        // vm.getMap = getMap;
        console.log(vm.game);

        if ($scope.mode === 'edit') {

            return connection.get('/api/gamesv2/get/' + game._id, { id: game._id }).then(function (data) {
                var game = data.item;
            });
        }

        if($scope.mode === 'edit') {
            connection.post('/api/gamesv2/update/' + game._id, game).then(function (result) {
                if (result.result === 1) {

                }
            });
        }

        console.log(game);

        // function getMap (mapID) {
        //     return vm.game.maps.find(m => m.id === mapID);
        // }
  }
