'use strict';

angular.module('app', [
    'ngRoute', 'ui.sortable', 'draganddrop', 'ui.bootstrap',
    'urungi.directives', 'ngSanitize', 'ui.select', 'angularUUID2', 'vs-repeat',
    'ui.bootstrap.datetimepicker', 'ui.tree', 'page.block', 'bsLoadingOverlay', 'xeditable',
    'intro.help', 'ngFileUpload', 'colorpicker.module',
    'wst.inspector', 'gettext', 'ngFileSaver'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/home'});

        $routeProvider.when('/home', {
            templateUrl: 'view/home/index.html',
            controller: 'homeCtrl'
        });

        $routeProvider.when('/about', {
            templateUrl: 'view/home/about.html',
            controller: 'homeCtrl'
        });

        $routeProvider.when('/gameList', {
            templateUrl: 'view/menu-list/gameList.html',
            controller: 'gameListCtrl'
        });

        $routeProvider.when('/view/:gameID', {
            templateUrl: 'view/game/view.html',
            controller: 'gameCtrl'
        });

        $routeProvider.when('/view/new/:newGame/', {
            templateUrl: 'view/game/edit.html',
            controller: 'gameCtrl'
        });

        $routeProvider.when('/view/game/edit/:gameID/', {
            templateUrl: 'view/game/edit.html',
            controller: 'gameCtrl'
        });


        $routeProvider.when('/editor', {
            templateUrl: 'view/editor/editor.html',
            controller: 'editorCtrl'
        });

        // pages
        $routeProvider.when('/pages', {
            templateUrl: 'partials/pages/list.html',
            controller: 'pagesCtrl'
        });
        $routeProvider.when('/page/:extra', {
            templateUrl: 'partials/pages/list.html',
            controller: 'pagesCtrl'
        });

        $routeProvider.when('/pages/:pageID', {
            templateUrl: 'partials/pages/view.html',
            controller: 'pagesCtrl'
        });

        $routeProvider.when('/pages/edit/:pageID/', {
            templateUrl: 'partials/pages/edit.html',
            controller: 'pagesCtrl'
        });

        $routeProvider.when('/pages/new/:newPage/', {
            templateUrl: 'partials/pages/edit.html',
            controller: 'pagesCtrl'
        });

    }])
    .factory('$sessionStorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.sessionStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.sessionStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.sessionStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return ($window.sessionStorage[key]) ? JSON.parse($window.sessionStorage[key]) : false;
            },
            removeObject: function (key) {
                delete ($window.sessionStorage[key]);
            }
        };
    }])
    .factory('$localStorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return ($window.localStorage[key]) ? JSON.parse($window.localStorage[key]) : false;
            },
            removeObject: function (key) {
                delete ($window.localStorage[key]);
            }
        };
    }]);

angular.module('app').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

angular.module('app').service('gameService', function () {
    var theGame = {};

    var addGame = function (newObj) {
        theGame = newObj;
    };

    var getGame = function () {
        return theGame;
    };

    return {
        addReport: addGame,
        getReport: getGame
    };
});

angular.module('app').run(['$rootScope', '$sessionStorage', 'connection', function ($rootScope, $sessionStorage, connection) {
    $rootScope.removeFromArray = function (array, item) {
        var index = array.indexOf(item);

        if (index > -1) array.splice(index, 1);
    };

    $rootScope.goBack = function () {
        window.history.back();
    };

    $rootScope.getUserContextHelp = function (contextHelpName) {
        var found = false;

        if ($rootScope.user.contextHelp) {
            for (var i in $rootScope.user.contextHelp) {
                if ($rootScope.user.contextHelp[i] === contextHelpName) {
                    found = true;
                }
            }
        }

        return !found;
    };

    $rootScope.setUserContextHelpViewed = function (contextHelpName) {
        var params = {};
        params.contextHelpName = contextHelpName;
        connection.get('/api/set-viewed-context-help', params, function (data) {
            $rootScope.user.contextHelp = data.items;
        });
    };


angular.module('app').run(function (bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        delay: 0, // Minimal delay to hide loading overlay in ms.
        activeClass: undefined, // Class that is added to the element where bs-loading-overlay is applied when the overlay is active.
        templateUrl: 'partials/loading-overlay-template.html' // Template url for overlay element. If not specified - no overlay element is created.
    });
});

// Set default options for xeditable
angular.module('app').run(['editableOptions', function (editableOptions) {
    editableOptions.buttons = 'no';
}]);

angular.module('app').run(['language', function (language) {
    language.setLanguageFromLocalStorage();
}]);

function isWSTADMIN ($rootScope) {
    var found = false;
    for (var i in $rootScope.user.roles) {
        if ($rootScope.user.roles[i] === 'WSTADMIN') { found = true; }
    }

    return found;
}
