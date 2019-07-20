(function () {
    'use strict';

    angular.module('app.maps').config(configure);

    configure.$inject = ['$routeProvider'];

    function configure ($routeProvider) {

      $routeProvider.when('/maps/edit/:mapID', {
          templateUrl: 'partials/maps/edit.html',
          controller: 'MapsViewController',
          controllerAs: 'vm',
          resolve: {
              map: function ($route, mapModel) {
                  return mapModel.getMapDefinition($route.current.params.mapID, false);
              },
          },
          isPublic: true,
});

        $routeProvider.when('/maps', {
            templateUrl: 'partials/maps/list.html',
            controller: 'MapsListController',
            controllerAs: 'vm',
        });
    }
})();
