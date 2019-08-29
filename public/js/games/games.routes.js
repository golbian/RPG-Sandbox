(function () {
    'use strict';

    angular.module('app.games').config(configure);

    configure.$inject = ['$routeProvider'];

    function configure ($routeProvider) {
        $routeProvider.when('/games/view/:gameID', {
            templateUrl: 'partials/games/edit.html',
            controller: 'GamesViewController',
            controllerAs: 'vm',
            resolve: {
                game: function ($route, api) {
                    return api.getGame($route.current.params.gameID);
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
