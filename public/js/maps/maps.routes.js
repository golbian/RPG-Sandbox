(function () {
    'use strict';

    angular.module('app.maps').config(configure);

    configure.$inject = ['$routeProvider'];

    function configure ($routeProvider) {

        $routeProvider.when('/maps', {
            templateUrl: 'partials/maps/list.html',
            controller: 'MapsListController',
            controllerAs: 'vm',
        });
    }
})();
