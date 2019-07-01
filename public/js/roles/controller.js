angular.module('app').controller('rolesCtrl', function ($scope, connection, $routeParams, uuid2, userService) {
    $scope.items = [];
    $scope.roleModal = 'partials/roles/roleModal.html';

    userService.getCurrentUser().then(user => {
        $scope.sharedSpace = user.companyData.sharedSpace;
    });

    $scope.newRole = function () {
        $scope._Role = {};
        $scope._Role.permissions = [];
        $scope._Role.mapsCreate = false;
        $scope._Role.mapsShare = false;
        $scope._Role.gamesCreate = false;
        $scope._Role.gamesShare = false;
        $scope._Role.viewSQL = false;
        $scope._Role.grants = [];
        $scope.mode = 'add';
        $('#roleModal').modal('show');
    };

    $scope.view = function (roleID) {
        if (roleID) {
            connection.get('/api/roles/find-one', { id: roleID }).then(function (data) {
                $scope._Role = data.item;
                $scope.mode = 'edit';
                $scope.clearNodes($scope.sharedSpace);
                $scope.checkForNode($scope.sharedSpace);
                $('#roleModal').modal('show');
            });
        };
    };

    $scope.save = function () {
        // $scope._Role.grants = $scope.grants;
        if ($scope.mode === 'add') {
            var data = $scope._Role;

            connection.post('/api/roles/create', data).then(function (data) {
                $scope.items.push(data.item);
                $('#roleModal').modal('hide');
            });
        } else {
            connection.post('/api/roles/update/' + $scope._Role._id, $scope._Role).then(function (result) {
                if (result.result === 1) {
                    $('#roleModal').modal('hide');
                }
            });
        }
    };

    $scope.getRoles = function (page, search, fields) {
        var params = {};

        params.page = (page) || 1;

        if (search) {
            $scope.search = search;
        } else if (page === 1) {
            $scope.search = '';
        }
        if ($scope.search) {
            params.search = $scope.search;
        }

        if (fields) params.fields = fields;

        connection.get('/api/roles/find-all', params).then(function (data) {
            $scope.items = data.items;
            $scope.page = data.page;
            $scope.pages = data.pages;
        });
    };

    $scope.goToPage = function (page) {
        $scope.getRoles(page, '', ['name', 'description']);
    };

    $scope.clickedExecutePagesForTheNode = function (node) {
        setGrant(node);
        for (var i in node.nodes) {
            node.nodes[i].executePages = node.executePages;
            setGrant(node.nodes[i]);
            if (node.nodes[i].nodes.length > 0) { $scope.clickedExecutePagesForTheNode(node.nodes[i]); }
        }
    };

    $scope.clickedExecuteMapsForTheNode = function (node) {
        setGrant(node);
        for (var i in node.nodes) {
            node.nodes[i].executeMaps = node.executeMaps;
            setGrant(node.nodes[i]);
            if (node.nodes[i].nodes.length > 0) { $scope.clickedExecuteMapsForTheNode(node.nodes[i]); }
        }
    };

    $scope.clickedExecuteGamesForTheNode = function (node) {
        setGrant(node);
        for (var i in node.nodes) {
            node.nodes[i].executeGames = node.executeGames;
            setGrant(node.nodes[i]);
            if (node.nodes[i].nodes.length > 0) { $scope.clickedExecuteGamesForTheNode(node.nodes[i]); }
        }
    };

    $scope.clickedShareMapsForTheNode = function (node) {
        setGrant(node);
        for (var i in node.nodes) {
            node.nodes[i].shareMaps = node.shareMaps;
            setGrant(node.nodes[i]);
            if (node.nodes[i].nodes.length > 0) { $scope.clickedShareMapsForTheNode(node.nodes[i]); }
        }
    };

    function setGrant (node) {
        if (!$scope._Role.grants) { $scope._Role.grants = []; }

        var grants = $scope._Role.grants;

        var found = false;

        for (var i in grants) {
            if (grants[i].folderID === node.id) {
                found = true;
                grants[i].executePages = node.executePages;
                grants[i].executeMaps = node.executeMaps;
                grants[i].executeGames = node.executeGames;
                grants[i].shareMaps = node.shareMaps;
            }
        }

        if (!found) {
            grants.push({
                folderID: node.id,
                executePages: node.executePages,
                executeMaps: node.executeMaps,
                executeGames: node.executeGames,
                shareMaps: node.shareMaps
            });
        }
    }

    $scope.clearNodes = function (nodes) {
        for (var n in nodes) {
            var node = nodes[n];
            if (node.nodes) {
                if (node.nodes.length > 0) { $scope.clearNodes(node.nodes); }
            }

            node.executePages = undefined;
            node.executeMaps = undefined;
            node.executeGames = undefined;
            node.shareMaps = undefined;
        }
    };

    $scope.checkForNode = function (nodes) {
        var grants = $scope._Role.grants;

        for (var n in nodes) {
            var node = nodes[n];
            if (node.nodes) {
                if (node.nodes.length > 0) { $scope.checkForNode(node.nodes); }
            }

            for (var i in grants) {
                if (node.id === grants[i].folderID) {
                    node.executePages = grants[i].executePages;
                    node.executeMaps = grants[i].executeMaps;
                    node.executeGames = grants[i].executeGames;
                    node.shareMaps = grants[i].shareMaps;
                }
            }
        }
    };
});
