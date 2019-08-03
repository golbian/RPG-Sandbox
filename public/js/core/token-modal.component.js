(function () {
    'use strict';

    angular.module('app.core').component('appTokenModal', {
        templateUrl: 'partials/core/token-modal.html',
        controller: TokenModalController,
        controllerAs: 'vm',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    TokenModalController.$inject = ['tokenStats'];

    function TokenModalController (tokenStats) {
        const vm = this;

        vm.stats = {};
        vm.$onInit = $onInit;

        function $onInit () {
            vm.stats = vm.resolve.stats;
            tokenStats.getCurrentStats();
            });
        }
    }
})();
