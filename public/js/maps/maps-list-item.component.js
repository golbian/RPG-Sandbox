(function () {
    'use strict';

    angular.module('app.maps').component('appMapsListItem', {
        templateUrl: 'partials/maps/maps-list-item.html',
        controller: MapsListItemController,
        controllerAs: 'vm',
        bindings: {
            map: '<',
            onDelete: '&',
            onDuplicate: '&',
        },
    });

    MapsListItemController.$inject = ['$uibModal', 'api', 'mapModel', 'gettextCatalog'];

    function MapsListItemController ($uibModal, api, mapModel, gettextCatalog) {
        const vm = this;

        vm.openDeleteModal = openDeleteModal;
        vm.openDuplicateModal = openDuplicateModal;
        vm.publish = publish;
        vm.unpublish = unpublish;
        vm.share = share;
        vm.unshare = unshare;
        vm.getCopyLink = getCopyLink;

        function openDeleteModal () {
            const modal = $uibModal.open({
                component: 'appDeleteModal',
                resolve: {
                    title: () => gettextCatalog.getString('Delete {{name}} ?', { name: vm.map.mapName }),
                    delete: () => function () {
                        return api.deleteMap(vm.map._id);
                    },
                },
            });
            modal.result.then(function () {
                vm.onDelete();
            });
        }

        function openDuplicateModal () {
            const modal = $uibModal.open({
                component: 'appDuplicateModal',
                resolve: {
                    name: () => vm.map.mapName,
                    duplicate: () => function (newName) {
                        const params = {
                            map: { _id: vm.map._id },
                            newName: newName,
                        };

                        return mapModel.duplicateMap(params);
                    },
                },
            });
            modal.result.then(function () {
                vm.onDuplicate();
            });
        }

        function publish () {
            return api.publishMap(vm.map._id).then(() => {
                vm.map.isPublic = true;
            });
        }

        function unpublish () {
            return api.unpublishMap(vm.map._id).then(() => {
                vm.map.isPublic = false;
            });
        }

        function share (folderID) {
            return api.shareMap(vm.map._id, folderID).then(() => {
                vm.map.isShared = true;
                vm.map.parentFolder = folderID;
            });
        }

        function unshare () {
            return api.unshareMap(vm.map._id).then(() => {
                vm.map.parentFolder = undefined;
                vm.map.isShared = false;
            });
        }

        function getCopyLink () {
            const protocol = window.location.protocol;
            const host = window.location.host;
            return protocol + '//' + host + '/#/maps/view/' + vm.map._id;
        }
    }
})();
