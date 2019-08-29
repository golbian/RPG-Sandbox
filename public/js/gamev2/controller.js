angular.module('app').controller('gamev2Ctrl', function ($scope, $location, $q,
  connection, $routeParams, mapModel, uuid2, gamev2Model, $timeout,
    gettextCatalog, $uibModal, userService, api) {
    $scope.mapModal = 'partials/map/edit.html';
    $scope.selectedGame = {};
    $scope.selectedGame.gameName = 'newMap';
    $scope.selectedGame.maps = [];
    $scope.selectedGame.players = [];
    $scope.selectedGame.properties = {};
    $scope.mode = 'add';
    $scope.selectedGame.properties.description = "";


    $scope.newMap = function () {
        $scope.mapInterface = true;
        $scope.editingMap = null;
        $scope.$broadcast('newMapForGame', {});
    };

    $scope.importMap = function () {
        const modal = $uibModal.open({
            component: 'appMapsImportModal',
        });
        modal.result.then(mapID => {
            mapModel.getMapDefinition(mapID).then(function (map) {
                if (map) {
                    map.id = map._id;
                    $scope.selectedGame.maps.push(map);
                } else {
                    noty({ text: 'Error : failed to import map', type: 'error', timeout: 3000 });
                }
            });
        });
    };

    $scope.addPlayer = function () {
        const modal = $uibModal.open({
            component: 'appPlayersImportModal',
        });
        modal.result.then(userID => {
            userService.getCurrentUsers(mapID).then(function (user) {
                if (map) {
                    map.id = map._id;
                    $scope.selectedGame.players.push(user);
                } else {
                    noty({ text: 'Error : failed to import map', type: 'error', timeout: 3000 });
                }
            });
        });
    };

    setTimeout(function () {
      console.log($scope.selectedGame);
    }, 10000);

    $scope.$on('cancelMap', function (event, args) {
        $scope.mapInterface = false;
    });

        if ($scope.mode === 'add') {
            $scope.gameID = uuid2.newguid();
          }

    $scope.cancelMap = function (map) {
        $scope.mapInterface = false;
    };

    var mapBackup;
    $scope.loadMap = function (map) {
        $scope.mapInterface = true;
        $scope.editingMap = map.id;
        //mapBackup = clone(map);
        mapBackup = angular.copy(map);
        for (var i in $scope.selectedGame.maps) {
            if ($scope.selectedGame.maps[i]._id === map._id) {
                //$scope.selectedGame.maps.splice(i,1);
                $scope.editingMapIndex = i;
            }
        }
        console.log(mapBackup);
        $scope.$broadcast('loadMapStrucutureForGame', { map: mapBackup });
    };

    $scope.gameName = function () {
        if ($scope.mode === 'add') {
            $('#gameNameModal').modal('show');
            $scope.gameNameSave();
          }
    };

    $scope.gameNameSave = function () {
      return gamev2Model.saveAsGame($scope.selectedGame, $scope.mode).then(function () {
        $('#gameNameModal').modal('hide');
        $('.modal-backdrop').hide();

        // $scope.mode = 'edit';
        $scope.goBack();
      });
    };

    $scope.getMap = function (mapID) {
        return $scope.selectedGame.maps.find(m => (m.id === mapID));
    };

    function clone (obj) {
        if (obj == null || typeof obj !== 'object') return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    $scope.deleteMap = function (mapID, mapName) {
        for (var i in $scope.selectedGame.maps) {
            if ($scope.selectedGame.maps[i].id === mapID) {
                $scope.selectedGame.maps.splice(i, 1);

                $('#MAP_' + mapID).remove();
            }
        }
    };

});
