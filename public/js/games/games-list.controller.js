(function () {
    'use strict';

    angular.module('app.games').controller('GamesListController', GamesListController);

    GamesListController.$inject = ['$location', '$timeout', 'api', 'gettextCatalog', 'userService'];

    function GamesListController ($location, $timeout, api, gettextCatalog, userService) {
        const vm = this;

        vm.games = [];
        vm.columns = [];
        vm.creationAuthorised = false;
        vm.refresh = refresh;

        activate();

        function activate () {
            vm.columns = getColumns();

            userService.getCurrentUser().then(user => {
                vm.creationAuthorised = user.gamesCreate;
            });
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


    }
})();
