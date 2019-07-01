(function () {
    'use strict';

    angular.module('app.maps').component('appMapsImportModal', {
        templateUrl: 'partials/maps/maps-import-modal.html',
        controller: MapsImportModalController,
        controllerAs: 'vm',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    MapsImportModalController.$inject = ['api'];

    function MapsImportModalController (api) {
        const vm = this;

        vm.maps = [];
        vm.columns = [];
        vm.lastRefreshParams = {};
        vm.$onInit = $onInit;
        vm.refresh = refresh;

        function $onInit () {
            vm.columns = getColumns();
        }

        function refresh (params) {
            params = params || vm.lastRefreshParams;
            vm.lastRefreshParams = params;

            params.fields = ['mapName', 'isPublic'];

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
                    width: 12,
                },
            ];
        }
    }
})();
