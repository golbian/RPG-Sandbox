(function () {
    'use strict';

    angular.module('app', [
        'ngRoute',
        'ngSanitize',
        'ngFileUpload',
        'ngFileSaver',
        'ui.sortable',
        'ui.bootstrap',
        'ui.select',
        'ui.bootstrap.datetimepicker',
        'ui.tree',
        'draganddrop',
        'vs-repeat',
        'xeditable',
        'gettext',
        'app.core',
        'app.sidebar',
        'app.maps',
        'app.games',
        'app.users',
        //'app.templates',
    ]);

    angular.module('app').config(configure);

    configure.$inject = ['$routeProvider', '$locationProvider'];

    function configure ($routeProvider, $locationProvider) {
        // TODO Use the default prefix '!' or use HTML5 mode
        $locationProvider.hashPrefix('');

        $routeProvider.otherwise({ redirectTo: '/home' });

        $routeProvider.when('/home', {
            templateUrl: 'partials/home/index.html',
            controller: 'homeCtrl'
        });

        $routeProvider.when('/about', {
            templateUrl: 'partials/home/about.html',
            controller: 'homeCtrl'
        });

        $routeProvider.when('/games/new/:newGame/', {
            templateUrl: 'partials/gamev2/edit.html',
            controller: 'gamev2Ctrl'
        });

        $routeProvider.when('/games/edit/:gameID/', {
            templateUrl: 'partials/gamev2/edit.html',
            controller: 'gamev2Ctrl'
        });

        $routeProvider.when('/games/push/:gameID/', {
            templateUrl: 'partials/gamev2/edit.html',
            controller: 'gamev2Ctrl'
        });

        $routeProvider.when('/maps/new/', {
            templateUrl: 'partials/map/edit.html',
            controller: 'mapCtrl'
        });

        // roles
        $routeProvider.when('/roles', {
            templateUrl: 'partials/roles/list.html',
            controller: 'rolesCtrl'
        });

        $routeProvider.when('/logout', {
            templateUrl: 'partials/logout/index.html',
            controller: 'logOutCtrl'
        });

        // spaces
        $routeProvider.when('/shared-space', {
            templateUrl: 'partials/spaces/index.html',
            controller: 'spacesCtrl'
        });

        // explore
        $routeProvider.when('/explore', {
            templateUrl: 'partials/map/edit.html',
            controller: 'mapCtrl'
        });

        // imports and exports

        $routeProvider.when('/import', {
            templateUrl: 'partials/io/import.html',
            controller: 'ioCtrl'
        });

        $routeProvider.when('/export', {
            templateUrl: 'partials/io/export.html',
            controller: 'ioCtrl'
        });
    }
})();
