(function () {
    'use strict';

    angular.module('app.maps').controller('MapsListController', MapsListController);

    MapsListController.$inject = ['$location', '$timeout', 'api', 'gettextCatalog', 'userService'];

    function MapsListController ($location, $timeout, api, gettextCatalog, userService) {
        const vm = this;

        vm.maps = [];
        vm.columns = [];
        vm.creationAuthorised = false;
        vm.refresh = refresh;

        activate();

        function activate () {
            vm.columns = getColumns();

            userService.getCurrentUser().then(user => {
                vm.creationAuthorised = user.mapsCreate;
            });
        }

        function refresh (params) {
            params = params || vm.lastRefreshParams;
            vm.lastRefreshParams = params;

            params.fields = ['mapName', 'isPublic', 'isShared', 'parentFolder', 'owner', 'author', 'createdOn'];

            return api.mapsFindAll(params).then(result => {
                vm.maps = result.items;

                return { page: result.page, pages: result.pages };
            });
        }

        function getColumns () {
            return [
                {
                    name: 'mapName',
                    label: 'Name',
                    width: 3,
                    filter: true,
                },
                {
                    name: 'author',
                    label: 'Author',
                    width: 2,
                    filter: true,
                },
                {
                    name: 'createdOn',
                    label: 'Date of creation',
                    width: 2,
                },
            ];
        }

    }
})();
