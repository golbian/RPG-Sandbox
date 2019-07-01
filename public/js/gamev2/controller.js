angular.module('app').controller('gamev2Ctrl', function ($scope, $location, $q,
    mapsService, connection, $routeParams, mapModel, uuid2, gamev2Model, grid, $timeout,
    gettextCatalog, $uibModal, userService, api
) {
    $scope.mapModal = 'partials/map/edit.html';
    $scope.settingsHtml = 'partials/pages/settings.html';
    $scope.queriesHtml = 'partials/pages/queries.html';
    $scope.settingsTemplate = 'partials/widgets/inspector.html';

    $scope.selectedGame = { maps: [], containers: [], prompts: [] };


    $scope.theData = [];
    $scope.mode = 'preview';

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

    $scope.$on('cancelMap', function (event, args) {
        $scope.mapInterface = false;
    });

    $scope.initForm = function () {
        if (/new/.test($location.path())) {
            $scope.mode = 'add';
        }

        if (/edit/.test($location.path())) {
            $scope.gameID = $routeParams.gameID;
            $scope.mode = 'edit';
        }

        if (/push/.test($location.path())) {
            $scope.gameID = $routeParams.gameID;
            if ($scope.gameID === 'new') {
                $scope.mode = 'add';
            } else {
                $scope.mode = 'edit';
            }
        }

        if ($scope.mode === 'add') {
            $scope.gameID = uuid2.newguid();
            $scope.selectedGame = {
                gameName: 'New Game',
                maps: [],
                items: [],
                properties: {},
                gameType: 'DEFAULT'
            };

            if (/push/.test($location.path())) {
                const pushedMap = mapsService.getStoredMap();
                pushedMap.mapName = 'map_' + ($scope.selectedGame.maps.length + 1);
                pushedMap.id = uuid2.newguid();
                $scope.selectedGame.maps.push(pushedMap);
            }
        };

        if ($scope.mode === 'edit') {

            if (!$scope.gameID) {
                noty({ text: 'Could not load game : missing id', type: 'error', timeout: 4000 });
            }

            return connection.get('/api/gamesv2/get/' + $scope.gameID, { id: $scope.gameID }).then(function (data) {
                $scope.selectedGame = data.item;

                if (/push/.test($location.path())) {
                    const pushedMap = mapsService.getStoredMap();
                    pushedMap.mapName = 'map_' + ($scope.selectedGame.maps.length + 1);
                    pushedMap.id = uuid2.newguid();
                    $scope.selectedGame.maps.push(pushedMap);
                }


                angular.element(document).injector().invoke(function ($compile) {
                    $compile($div)($scope);
                });

            });
        }
    };

    $scope.cancelMap = function (map) {
        $scope.mapInterface = false;
    };

    $scope.saveMap4Game = function (isMode) {
        // first clean the results area for not to create a conflict with other elements with same ID
        var el = document.getElementById('mapLayout');
        angular.element(el).empty();

        var qstructure = mapsService.getStoredMap();

        if ($scope.editingMap == null) {
            qstructure.mapName = 'map_' + ($scope.selectedGame.maps.length + 1);
            qstructure.id = uuid2.newguid();
            $scope.selectedGame.maps.push(qstructure);
        } else {
            var updatedMap = angular.copy(qstructure);
            $scope.selectedGame.maps.splice($scope.editingMapIndex, 1, updatedMap);
            // mapModel.getMap(updatedMap, 'MAP_' + qstructure.id, $scope.mode, function (sql) {});
        }
        $scope.mapInterface = false;
        // getAllPageColumns();
    };



    var mapBackup;
    $scope.loadMap = function (map) {
        $scope.mapInterface = true;
        $scope.editingMap = map.id;
        // mapBackup = clone(map);
        mapBackup = angular.copy(map);
        for (var i in $scope.selectedGame.maps) {
            if ($scope.selectedGame.maps[i].id === map.id) {
                // $scope.selectedGame.maps.splice(i,1);
                $scope.editingMapIndex = i;
            }
        }
        $scope.$broadcast('loadMapStrucutureForGame', { map: mapBackup });
    };



    $scope.elementDblClick = function (theElement) {
    };

    $scope.gameName = function () {
        if ($scope.mode === 'add') {
            $('#gameNameModal').modal('show');
        } else {
            saveGame();
        }
    };

    $scope.gameNameSave = function () {
        $('#gameNameModal').modal('hide');
        $('.modal-backdrop').hide();
        saveGame();
        // $scope.mode = 'edit';
        $scope.goBack();
    };

    function cleanAll (theContainer) {
        var root = document.getElementById(theContainer);

        if (typeof root !== 'undefined') {
            cleanElement(root);
        }
    }

    $scope.getMap = function (mapID) {
        return $scope.selectedGame.maps.find(r => (r.id === mapID));
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

    $scope.editMap = function (mapID, mapName) {

    };

});
