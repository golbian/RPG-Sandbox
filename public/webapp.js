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
            templateUrl: 'public/view/index/index.html',
            controller: 'homeCtrl'
        });

        $routeProvider.when('/game/view', {
            templateUrl: 'public/view/game/game.html',
            controller: 'gameCtrl'
        });

        $routeProvider.when('/maps/view', {
            templateUrl: 'public/maps/maps.html',
            controller: 'mapsCtrl'
        });

        $routeProvider.when('/search', {
            templateUrl: 'public/view/search/search.html',
            controller: 'searchCtrl'
        });

        $routeProvider.when('/game/new/:newgame/', {
            templateUrl: 'public/view/game/edit.html',
            controller: 'gameCtrl'
        });

        $routeProvider.when('/maps/new/:newmap/', {
            templateUrl: 'public/view/maps/edit.html',
            controller: 'mapsCtrl'
        });

        $routeProvider.when('/game/push/:gameID', {
            templateUrl: 'public/view/game/edit.html',
            controller: 'gameCtrl'
        });

        $routeProvider.when('/game', {
            templateUrl: 'public/view/menu-list/gameList.html',
            controller: 'gameListCtrl'
        });

        $routeProvider.when('/maps', {
            templateUrl: 'public/view/menu-list/mapsList.html',
            controller: 'mapsListCtrl'
        });


        $routeProvider.when('/reports/fullscreen/:reportID/', {
            templateUrl: 'partials/report/fullscreen.html',
            controller: 'reportCtrl'
        });

        // users

        $routeProvider.when('/users', {
            templateUrl: 'public/view/users/list.html',
            controller: 'AdminUsersCtrl'
        });

        $routeProvider.when('/users/:userID/', {
            templateUrl: 'public/view/users/view.html',
            controller: 'AdminUsersCtrl'
        });

        $routeProvider.when('/public/new/:newUser/', {
            templateUrl: 'public/view/users/edit.html',
            controller: 'AdminUsersCtrl'
        });

        $routeProvider.when('/users/edit/:userID/', {
            templateUrl: 'public/view/users/edit.html',
            controller: 'AdminUsersCtrl'
        });
        // roles
        $routeProvider.when('/roles', {
            templateUrl: 'public/view/roles/list.html',
            controller: 'rolesCtrl'
        });

        $routeProvider.when('/roles/:roleID/', {
            templateUrl: 'public/view/roles/view.html',
            controller: 'rolesCtrl'
        });

        $routeProvider.when('/roles/new/:newRole/', {
            templateUrl: 'public/view/roles/editNew.html',
            controller: 'rolesCtrl'
        });
        $routeProvider.when('/logout', {
            templateUrl: 'public/view/logout/index.html',
            controller: 'logOutCtrl'
        });

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

angular.module('app').service('reportService', function () {
    var theReport = {};

    var addReport = function (newObj) {
        theReport = newObj;
    };

    var getReport = function () {
        return theReport;
    };

    return {
        addReport: addReport,
        getReport: getReport
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


    $rootScope.user = $sessionStorage.getObject('user');
    if (!$rootScope.user) {
        connection.get('/api/get-user-data', {}, function (data) {
            if (!data.items.user) {
                window.location.href = '/login';
                return;
            }

            var theUser = data.items.user;
            theUser.companyData = data.items.companyData;
            theUser.rolesData = data.items.rolesData;
            theUser.reportsCreate = data.items.reportsCreate;
            theUser.dashboardsCreate = data.items.dashboardsCreate;
            theUser.pagesCreate = data.items.pagesCreate;
            theUser.exploreData = data.items.exploreData;
            theUser.isWSTADMIN = data.items.isWSTADMIN;
            theUser.contextHelp = data.items.contextHelp;
            theUser.dialogs = data.items.dialogs;
            theUser.viewSQL = data.items.viewSQL;
            $rootScope.user = theUser;
            $sessionStorage.setObject('user', theUser);
            $rootScope.isWSTADMIN = isWSTADMIN($rootScope);
        });
    } else {
        $rootScope.isWSTADMIN = isWSTADMIN($rootScope);
    }
}]);

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
