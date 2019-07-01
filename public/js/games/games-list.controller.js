(function () {
    'use strict';

    angular.module('app.games').controller('GamesListController', GamesListController);

    GamesListController.$inject = ['$location', '$timeout', 'api', 'gettextCatalog', 'userService'];

    function GamesListController ($location, $timeout, api, gettextCatalog, userService) {
        const vm = this;

        vm.games = [];
        vm.introOptions = {};
        vm.columns = [];
        vm.creationAuthorised = false;
        vm.refresh = refresh;

        activate();

        function activate () {
            vm.columns = getColumns();
            vm.introOptions = getIntroOptions();

            userService.getCurrentUser().then(user => {
                vm.creationAuthorised = user.gamesCreate;
            });

            if ($location.hash() === 'intro') {
                $timeout(function () { vm.showIntro(); }, 1000);
            }
        }

        function refresh (params) {
            params = params || vm.lastRefreshParams;
            vm.lastRefreshParams = params;

            params.fields = ['gameName', 'isPublic', 'isShared', 'parentFolder', 'owner', 'author', 'createdOn'];

            return api.gamesFindAll(params).then(result => {
                vm.games = result.items;

                return { page: result.page, pages: result.pages };
            });
        }

        function getColumns () {
            return [
                {
                    name: 'gameName',
                    label: 'Name',
                    width: 4,
                    filter: true,
                },
                {
                    name: 'author',
                    label: 'Author',
                    width: 3,
                    filter: true,
                },
                {
                    name: 'createdOn',
                    label: 'Date of creation',
                    width: 3,
                },
            ];
        }

        function getIntroOptions () {
            const introOptions = {
                nextLabel: gettextCatalog.getString('Next'),
                prevLabel: gettextCatalog.getString('Back'),
                skipLabel: gettextCatalog.getString('Skip'),
                doneLabel: gettextCatalog.getString('Done'),
                tooltipPosition: 'auto',
                showStepNumbers: false,
                steps: [
                    {
                        intro: '<h4>' +
                            gettextCatalog.getString('Games') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('In here you can create and execute games like web pages.') +
                            '</strong></p><p>' +
                            gettextCatalog.getString('Define several maps using filters and dragging and dropping from different layers.') +
                            '</p><p>' +
                            gettextCatalog.getString('After you define the maps to get and visualize your data, you can drag and drop different html layout elements, and put your map in, using different formats to show it.') +
                            '</p>',
                    },
                    {
                        element: '#newGameButton',
                        intro: '<h4>' +
                            gettextCatalog.getString('New Game') +
                            '</h4><p>' +
                            gettextCatalog.getString('Click here to create a new game.') +
                            '</p>',
                    },
                    {
                        element: '#gameList',
                        intro: '<h4>' +
                            gettextCatalog.getString('Games list') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('Here all your games are listed.') +
                            '</strong></p><p>' +
                            gettextCatalog.getString('Click over a game\'s name to execute it.') +
                            '</p><p>' +
                            gettextCatalog.getString('You can also modify or drop the game, clicking into the modify or delete buttons.') +
                            '</p>',
                    },
                    {
                        element: '.btn-edit',
                        intro: '<h4>' +
                            gettextCatalog.getString('Game edit') +
                            '</h4><p>' +
                            gettextCatalog.getString('Click here to modify the game.') +
                            '</p>',
                    },
                    {
                        element: '.btn-delete',
                        intro: '<h4>' +
                            gettextCatalog.getString('Game delete') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('Click here to delete the game.') +
                            '</strong></p><p>' +
                            gettextCatalog.getString('Once deleted the game will not be recoverable again.') +
                            '</p><p>' +
                            gettextCatalog.getString('Requires 2 step confirmation.') +
                            '</p>',
                    },
                    {
                        element: '.published-tag',
                        intro: '<h4>' +
                            gettextCatalog.getString('Game published') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('This label indicates that this game is public.') +
                            '</strong></p><p>' +
                            gettextCatalog.getString('If you drop or modify a published game, it will have and impact on other users, think about it before making any updates on the game.') +
                            '</p>',
                    }
                ]
            };

            return introOptions;
        }
    }
})();
