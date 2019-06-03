// Declare app level module which depends on filters, and services
angular.module('login', [])
    .service('Constants', function () {
        var constants = {
            DEBUGMODE: false,
        };

        return constants;
    })
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
    }]).service('connection', function ($http, Constants) {
        this.get = function (url, params, done, options) {
            options = {
                showLoader: (options && typeof options.showLoader !== 'undefined') ? options.showLoader : true,
                showMsg: (options && typeof options.showMsg !== 'undefined') ? options.showMsg : true
            };

            if (options.showLoader) $('#loader-overlay').show();

            $http({method: 'GET', url: url, params: params})
                .success(angular.bind(this, function (data, status, headers, config) {
                    if (typeof data === 'string') window.location.href = '/';

                    if (typeof done !== 'undefined' && done) { done(data); }

                    if (options.showLoader) $('#loader-overlay').hide();

                    if (data.result === 1 && data.msg && options.showMsg) {
                        noty({text: data.msg, timeout: 2000, type: 'success'});
                    } else if (data.result === 0 && data.msg && options.showMsg) {
                        noty({text: data.msg, timeout: 2000, type: 'error'});
                    }
                }))
                .error(angular.bind(this, function (data, status, headers, config) {
                    if (options.showLoader) $('#loader-overlay').hide();

                    noty({text: 'Error', timeout: 2000, type: 'error'});
                }));
        };

        this.post = function (url, data, done, options) {
            options = {
                showLoader: (options && typeof options.showLoader !== 'undefined') ? options.showLoader : true,
                showMsg: (options && typeof options.showMsg !== 'undefined') ? options.showMsg : true
            };

            if (options.showLoader) $('#loader-overlay').show();

            if (typeof data._id !== 'undefined') data.id = data._id;

            $http.post(url, data)
                .success(angular.bind(this, function (data, status, headers, config) {
                    if (typeof data === 'string') window.location.href = '/';

                    if (typeof done !== 'undefined' && done) { done(data); }

                    if (options.showLoader) $('#loader-overlay').hide();

                    if (data.result === 1 && data.msg && options.showMsg) {
                        noty({text: data.msg, timeout: 2000, type: 'success'});
                    } else if (data.result === 0 && data.msg && options.showMsg) {
                        noty({text: data.msg, timeout: 2000, type: 'error'});
                    }
                }))
                .error(angular.bind(this, function (data, status, headers, config) {
                    if (options.showLoader) $('#loader-overlay').hide();

                    noty({text: 'Error', timeout: 2000, type: 'error'});
                }));
        };

        return this;
    }).controller('PublicCtrl', function ($scope, $http, $rootScope, $sessionStorage, $localStorage, connection) {
        var user = $localStorage.getObject('user');

        $scope.loginError = false;
        $scope.errorLoginMessage = '';
        $scope.login = function () {
            var user = {'userName': $scope.userName, 'password': $scope.password, 'remember_me': $scope.rememberMe, 'companyID': $('#companyID').attr('value')};

            if ($scope.userName !== undefined || $scope.password !== undefined) {
                $http({method: 'POST', url: '/api/login', data: user, withCredentials: true})
                    .success(function (data, status, headers, config) {
                        $scope.loginError = false;

                        var theUser = data.user;

                        connection.get('/api/get-user-data', {}, function (data) {
                            if ($scope.rememberMe) {
                                $localStorage.setObject('user', user);
                            }
                            theUser.companyData = data.items.companyData;
                            theUser.rolesData = data.items.rolesData;
                            theUser.mapsCreate = data.items.mapsCreate;
                            theUser.gamesCreate = data.items.gamesCreate;
                            theUser.pagesCreate = data.items.pagesCreate;
                            theUser.exploreData = data.items.exploreData;
                            theUser.isWSTADMIN = data.items.isWSTADMIN;
                            theUser.contextHelp = data.items.contextHelp;
                            theUser.dialogs = data.items.dialogs;
                            $rootScope.user = theUser;
                            $sessionStorage.setObject('user', theUser);
                            $rootScope.loginRedirect();
                        });
                    })
                    .error(function (data, status, headers, config) {
                        $scope.errorLoginMessage = data;
                        $scope.loginError = true;
                    });
            }
        };

        if (user) {
            $scope.userName = user.userName;
            $scope.password = user.password;
            $scope.rememberMe = user.remember_me;

            $scope.login();
        }
    });

angular.module('login').run(['$http', '$rootScope', '$sce', '$sessionStorage', 'connection',
    function ($http, $rootScope, $sce, $sessionStorage, connection) {
        $rootScope.loginRedirect = function () {
            window.location.href = '/#/home';
        };
        const config = require('config');
        global.config = config;


        const hash = require('../server/util/hash');

        require('../server/config/mongoose')();
        const Users = connection.model('Users');
        const Companies = connection.model('Companies');

        if (process.argv.length !== 3) {
            console.error('Usage: node first-time-setup.js PASSWORD');
            process.exit(1);
        }

        (async function () {
            let company = await Companies.findOne({ companyID: 'COMPID' });
            if (company) {
                console.error('Company COMPID already exists. 1st time setup has already been done');
                process.exit(1);
            }

            const user = await Users.findOne({ userName: 'Goliatt' });
            if (user) {
                console.error('User Goliatt already exists. 1st time setup has already been done');
                process.exit(1);
            }

            const theCompany = {
                companyID: 'COMPID',
                createdBy: 'RPG-Sandbox setup',
                nd_trash_deleted: false,
            };
            company = await Companies.create(theCompany);

            function hashPassword (password) {
                return new Promise(function (resolve, reject) {
                    hash(password, function (err, salt, hash) {
                        if (err) {
                            return reject(err);
                        }

                        resolve({ salt: salt, hash: hash });
                    });
                });
            }

            const password = process.argv[2];
            const result = await hashPassword(password);

            const adminUser = {
                userName: 'Goliatt',
                salt: result.salt,
                hash: result.hash,
                companyID: company.companyID,
                roles: ['WSTADMIN'],
                status: 'active',
                nd_trash_deleted: false,
            };

            await Users.create(adminUser);

            connection.close();
        })();

}]);
