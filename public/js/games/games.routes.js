(function () {
    'use strict';

    angular.module('app.games').config(configure);

    configure.$inject = ['$routeProvider'];

    function configure ($routeProvider) {
        $routeProvider.when('/games/edit/:gameID', {
            templateUrl: 'partials/games/edit.html',
            controller: 'GamesViewController',
            controllerAs: 'vm',
            resolve: {
                game: function ($route, gamev2Model) {
                    return gamev2Model.getGameDefinition($route.current.params.gameID, false);
                },
            },
            isPublic: true,
        });

        $routeProvider.when('/games/list', {
            templateUrl: 'partials/games/list.html',
            controller: 'GamesListController',
            controllerAs: 'vm',
        });
    }
})();
