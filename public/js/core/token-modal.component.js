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

    TokenModalController.$inject = ['connection','$scope'];

    function TokenModalController (connection, $scope) {
        const vm = this;
        vm.item = {};
        vm.$onInit = $onInit;

        function $onInit () {
            vm.item._id = vm.resolve.id();
            connection.get('/api/token/find-one', {id: vm.item._id}).then(token => {
                vm.item.health = token.item.health;
                vm.item.mana = token.item.mana;
                vm.item.stamina = token.item.stamina;
            });
            }

          $scope.Save = function(){
            console.log(vm.item);
            connection.post('/api/token/update/' + vm.item.id, vm.item);
          }
        }
})();
