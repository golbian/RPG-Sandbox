(function () {
    'use strict';

    angular.module('app.games').component('appPlayersImportModal', {
        templateUrl: 'partials/games/players-import-modal.html',
        controller: PlayersImportModalController,
        controllerAs: 'vm',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    PlayersImportModalController.$inject = ['api'];

    function PlayersImportModalController (api) {
        const vm = this;

        vm.users = [];
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


            params.fields = ['userName','isWSTADMIN'];

            return api.getAllUsers(params).then(result => {
                vm.users = result.items;

                return { page: result.page, pages: result.pages };
            });
        }

        function getColumns () {
            return [
                {
                    name: 'userName',
                    label: 'Name',
                    width: 12,
                },
            ];
        }
    }
})();
