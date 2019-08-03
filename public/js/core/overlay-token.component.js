(function () {
    'use strict';

    angular.module('app.core').component('appOverlayToken', {
        templateUrl: 'partials/core/overlay-token.html',
        controller: OverlayTokenController,
        controllerAs: 'vm',
        bindings: {
            item: '<',
        },
    });

    OverlayTokenController.$inject = ['$uibModal', 'api'];

    function OverlayTokenController ($uibModal, api) {
        const vm = this;

        vm.opentokenModal = opentokenModal;

        function openTokenModal () {
            const modal = $uibModal.open({
                component: 'appTokenModal',
                resolve: {
                    item: () => vm.item,
                    tokenStats: api.getTokenData,
                },
            });
        }

        })();
