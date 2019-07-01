(function () {
    'use strict';

    angular.module('app.games').component('appGamesListItem', {
        templateUrl: 'partials/games/games-list-item.html',
        controller: GamesListItemController,
        controllerAs: 'vm',
        bindings: {
            game: '<',
            onDelete: '&',
            onDuplicate: '&',
        },
    });

    GamesListItemController.$inject = ['$uibModal', 'api', 'gamev2Model', 'gettextCatalog'];

    function GamesListItemController ($uibModal, api, gamev2Model, gettextCatalog) {
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
                    title: () => gettextCatalog.getString('Delete {{name}} ?', { name: vm.game.gameName }),
                    delete: () => function () {
                        return api.deleteGame(vm.game._id);
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
                    name: () => vm.game.gameName,
                    duplicate: () => function (newName) {
                        const params = {
                            game: { _id: vm.game._id },
                            newName: newName,
                        };

                        return gamev2Model.duplicateGame(params);
                    },
                },
            });
            modal.result.then(function () {
                vm.onDuplicate();
            });
        }

        function publish () {
            return api.publishGame(vm.game._id).then(() => {
                vm.game.isPublic = true;
            });
        }

        function unpublish () {
            return api.unpublishGame(vm.game._id).then(() => {
                vm.game.isPublic = false;
            });
        }

        function share (folderID) {
            return api.shareGame(vm.game._id, folderID).then(() => {
                vm.game.isShared = true;
                vm.game.parentFolder = folderID;
            });
        }

        function unshare (e) {
            return api.unshareGame(vm.game._id).then(() => {
                vm.game.parentFolder = undefined;
                vm.game.isShared = false;
            });
        }

        function getCopyLink () {
            const protocol = window.location.protocol;
            const host = window.location.host;
            return protocol + '//' + host + '/#/games/view/' + vm.game._id;
        }
    }
})();
