angular.module('app').controller('homeCtrl', ['$scope', '$rootScope', '$q', 'connection', 'gettextCatalog', 'userService', 'api', function ($scope, $rootScope, $q, connection, gettextCatalog, userService, api) {
    $scope.gamesNbr = 3;
    $scope.mapsNbr = 10;
    $scope.notificationsNbr = 0;
    $scope.alertsNbr = 0;
    $scope.subPage = 'js/map/list.html';

    function getIntraOptions () {
        $q.all({ user: userService.getCurrentUser(), counts: api.getCounts() }).then(result => {
            const { user, counts } = result;
            if (user.isWSTADMIN) {
                $scope.IntroOptions = {
                // IF width > 300 then you will face problems with mobile devices in responsive mode
                    steps: [
                        {
                            element: '#mainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('The main menu') +
                            '</h3><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Here you can access the basic operations in RPG-Sandbox') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('The "white" part of the menu is common for all users, the "green" part is only for RPG-Sandbox administrators') +
                            '</span></div>',
                            width: '300px',
                            height: '180px'
                        },
                        {
                            element: '#sharedArea',
                            html: '<div><h3>' +
                            gettextCatalog.getString('The shared area') +
                            '</h3><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Here all the shared elements (maps, games, pages) are displayed to be accessed by the users') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Depending on their permissions the users can access different folders and/or elements') +
                            '</span></div>',
                            width: '300px',
                            height: '180px'

                        },
                        {
                            element: '#latestExecutions',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Latest executions') +
                            '</h3><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Here are displayed the 10 latest element executions by the connected user, along with the last execution time') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px'
                        },
                        {
                            element: '#mostExecuted',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Most Executed') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span> <span style="font-weight:bold;">' +
                            gettextCatalog.getString('This area display the 10 most executed elements for the hole company and the number of executions per element') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px'
                        },
                        {
                            element: '#usersMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Users') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is only available for RPG-Sandbox administrators.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Access users to create new RPG-Sandbox users and to manage them') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#fff'
                        },
                        {
                            element: '#rolesMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Roles') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is only available for RPG-Sandbox administrators.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Access roles to create, manage roles, and grant or revoque permissions') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#fff'
                        },
                        {
                            element: '#datasourcesMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Data sources') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is only available for RPG-Sandbox administrators.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Access here to define the connections to the different sources of your information') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('You will define here your database connections to get the data used in the maps that will be created by the users') +
                            '</span></div>',
                            width: '300px',
                            height: '250px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#fff'
                        },
                        {
                            element: '#layersMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Layers') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is only available for RPG-Sandbox administrators.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Here you can define the semantic layer used by your users to access the data in the different data sources.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('You will define here the labels to use for every field, the joins between the different entities (tables), etc... All the necessary stuff to allow your users to create a map without any knowledge of the structure of your data') +
                            '</span></div>',
                            width: '300px',
                            height: '300px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#fff'
                        },
                        {
                            element: '#sharedSpaceMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Shared space') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is only available for RPG-Sandbox administrators.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Define here the folder structure for the shared area') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#fff'
                        },
                        {
                            element: '#myProfileMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('My profile') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is available for all users.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Access this to view info about your profile, change your password, etc...') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#exploreMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Explore') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is available for all users that have the grant for explore data.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Explore allow users to surf across the data without creating a map for that.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Use this if you want to query your data but is not necessary for you to save it for a later use') +
                            '</span></div>',
                            width: '300px',
                            height: '200px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#pagesMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Page maps') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is available for all users that have the grant to create pages.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Pages allow users to create and manage map pages.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Map pages are webpages that can be compromised of data in the form of charts or data grids, along with other HTML elements that allows to customize the map at the highest level') +
                            '</span></div>',
                            width: '300px',
                            height: '250px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#mapsMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Single query maps') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is available for all users that have the grant to create maps.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Maps allow users to create and manage single query maps.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Single Maps allow the user to configure a query against the data and get the results using different charts or a data grid, single maps are the elements that you use to create a game') +
                            '</span></div>',
                            width: '300px',
                            height: '250px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#gamesMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Single query games') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is available for all users that have the grant to create games.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Games allow users to create games using single query maps.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Games allow the user to group several single query maps in just one interface, when creating games you can define the area, size and position of every single query map into the game') +
                            '</span></div>',
                            width: '300px',
                            height: '250px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#homeMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Home') +
                            '</h3><span style="font-weight:bold;color:#8DC63F">' +
                            gettextCatalog.getString('This link is available for all users.') +
                            '</span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Use this link to back to this page') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '150px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#parentIntro',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Next Step') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span> <span style="font-weight:bold;">' +
                            gettextCatalog.getString('Setup a data source') +
                            '</span><br/><br/><br/><br/><br/><span> <a class="btn btn-info pull-right" href="/#/data-sources#intro">' +
                            gettextCatalog.getString('Go to data sources and continue tour') +
                            '</a></span></div>',
                            width: '500px',
                            objectArea: false,
                            verticalAlign: 'top',
                            height: '250px'
                        }
                    ]
                };
            } else {
                // the user is not WSTADMIN
                $scope.IntroOptions = {
                // IF width > 300 then you will face problems with mobile devices in responsive mode
                    steps: [
                        {
                            element: '#mainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('The main menu') +
                            '</h3><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Here you can access the basic operations in RPG-Sandbox') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px'
                        },
                        {
                            element: '#sharedArea',
                            html: '<div><h3>' +
                            gettextCatalog.getString('The shared area') +
                            '</h3><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Here all the shared shared elements (maps, games, pages) that you can execute') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Depending on your permissions you will be able to access different folders and/or elements') +
                            '</span></div>',
                            width: '300px',
                            height: '180px'

                        },
                        {
                            element: '#latestExecutions',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Latest executions') +
                            '</h3><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Here are displayed your 10 latest element executions, along with the last execution time') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px'
                        },
                        {
                            element: '#mostExecuted',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Most Executed') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span> <span style="font-weight:bold;">' +
                            gettextCatalog.getString('This area display your 10 most executed elements and the number of executions per element') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px'
                        },
                        {
                            element: '#myProfileMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('My profile') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Access this to view info about your profile, change your password, etc...') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '180px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#exploreMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Explore') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Explore allows you to surf across the data without creating a map for that.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Use this if you want to query your data but is not necessary for you to save it for a later use') +
                            '</span></div>',
                            width: '300px',
                            height: '200px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#pagesMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Page maps') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Pages allows you to create (if granted) and manage map pages.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Map pages are webpages that can be compromised of data in the form of charts or data grids, along with other HTML elements that allows you to customize the map at the highest level') +
                            '</span></div>',
                            width: '300px',
                            height: '250px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#mapsMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Single query maps') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Maps allows you to create (if granted) and manage your single query maps.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Using single query maps you can configure a query against the data and get the results using different charts or a simple data grid.') +
                            '</span></div>',
                            width: '300px',
                            height: '250px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#gamesMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Single query games') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Games allows you to create (if granted) and manage games using your previous defined single query maps.') +
                            '</span><br/><span>' +
                            gettextCatalog.getString('Using single query games you can group several single query maps in just one interface, you can define the area, size and position of every single query map into the game') +
                            '</span></div>',
                            width: '300px',
                            height: '250px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        },
                        {
                            element: '#homeMainMenu',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Home') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span><br/><span style="font-weight:bold;">' +
                            gettextCatalog.getString('Use this link to back to this page') +
                            '</span><br/><span></span></div>',
                            width: '300px',
                            height: '150px',
                            position: 'right',
                            areaColor: 'transparent',
                            areaLineColor: '#8DC63F'
                        }

                    ]
                };

                if (user.exploreData) {
                    $scope.IntroOptions.steps.push({
                        element: '#parentIntro',
                        html: '<div><h3>' +
                        gettextCatalog.getString('Next Step') +
                        '</h3><span style="font-weight:bold;color:#8DC63F"></span> <span style="font-weight:bold;">' +
                        gettextCatalog.getString('Explore data') +
                        '</span><br/><br/>' +
                        gettextCatalog.getString('See how you can explore data creating queries easily without any technical knowledge') +
                        '<br/><br/><br/><span> <a class="btn btn-info pull-right" href="/#/explore#intro">' +
                        gettextCatalog.getString('Go to data explorer and continue tour') +
                        '</a></span></div>',
                        width: '500px',
                        objectArea: false,
                        verticalAlign: 'top',
                        height: '250px'
                    });
                } else {
                    if (user.pagesCreate || counts.pages > 0) {
                        $scope.IntroOptions.steps.push({
                            element: '#parentIntro',
                            html: '<div><h3>' +
                            gettextCatalog.getString('Next Step') +
                            '</h3><span style="font-weight:bold;color:#8DC63F"></span> <span style="font-weight:bold;">' +
                            gettextCatalog.getString('Page maps') +
                            '</span><br/><br/>' +
                            gettextCatalog.getString('See how you can create customized web pages that shows your data using charts and data grids along with HTML components') +
                            '<br/><br/><br/><span> <a class="btn btn-info pull-right" href="/#/page#intro">' +
                            gettextCatalog.getString('Go to pages designer and continue tour') +
                            '</a></span></div>',
                            width: '500px',
                            objectArea: false,
                            verticalAlign: 'top',
                            height: '250px'
                        });
                    } else {
                        if (user.mapsCreate || counts.maps > 0) {
                            $scope.IntroOptions.steps.push({
                                element: '#parentIntro',
                                html: '<div><h3>' +
                                gettextCatalog.getString('Next Step') +
                                '</h3><span style="font-weight:bold;color:#8DC63F"></span> <span style="font-weight:bold;">' +
                                gettextCatalog.getString('Single query maps') +
                                '</span><br/><br/>' +
                                gettextCatalog.getString('See how you can create single query maps that shows your data using charts and data grids') +
                                '<br/><br/><br/><span> <a class="btn btn-info pull-right" href="/#/map#intro">' +
                                gettextCatalog.getString('Go to single query map designer and continue tour') +
                                '</a></span></div>',
                                width: '500px',
                                objectArea: false,
                                verticalAlign: 'top',
                                height: '250px'
                            });
                        } else {
                            if (user.gamesCreate || counts.dashBoards > 0) {
                                $scope.IntroOptions.steps.push({
                                    element: '#parentIntro',
                                    html: '<div><h3>' +
                                    gettextCatalog.getString('Next Step') +
                                    '</h3><span style="font-weight:bold;color:#8DC63F"></span> <span style="font-weight:bold;">' +
                                    gettextCatalog.getString('Games') +
                                    '</span><br/><br/>' +
                                    gettextCatalog.getString('See how to create games composed with a set of single query maps') +
                                    '<br/><br/><br/><span> <a class="btn btn-info pull-right" href="/#/game#intro">' +
                                    gettextCatalog.getString('Go to games and continue tour') +
                                    '</a></span></div>',
                                    width: '500px',
                                    objectArea: false,
                                    verticalAlign: 'top',
                                    height: '250px'
                                });
                            }
                        }
                    }
                }
            }
        });
    }

    connection.get('/api/get-user-last-executions', {}).then(function (data) {
        $scope.lastExecutions = [];
        $scope.mostExecutions = [];

        for (var l in data.items.theLastExecutions) {
            if (l < 10) {
                data.items.theLastExecutions[l]._id['lastDate'] = moment(data.items.theLastExecutions[l].lastDate).fromNow();
                $scope.lastExecutions.push(data.items.theLastExecutions[l]._id);
            }
        }
        for (var m in data.items.theMostExecuted) {
            if (m < 10) {
                data.items.theMostExecuted[m]._id['count'] = data.items.theMostExecuted[m].count;
                $scope.mostExecutions.push(data.items.theMostExecuted[m]._id);
            }
        }
    });

    $scope.getMaps = function (params) {
        params = params || {};

        connection.get('/api/maps/find-all', params).then(function (data) {
            $scope.maps = data;
        });
    };

    $scope.getGames = function (params) {
        params = params || {};

        connection.get('/api/games/find-all', params).then(function (data) {
            $scope.games = data;
        });
    };

    $scope.getCounts = function () {
    };

    $scope.setUserContextHelpViewed = function (contextHelpName) {
        var params = {};
        params.contextHelpName = contextHelpName;
        connection.get('/api/set-viewed-context-help', params).then(function (data) {
            $rootScope.userContextHelp = data.items;
        });
    };

    $scope.refreshHome = function () {
        api.getUserObjects().then(userObjects => {
            $scope.userObjects = userObjects;
        });

        getIntraOptions();
    };
    $scope.refreshHome();
}]);
