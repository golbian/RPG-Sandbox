angular.module('app').controller('spacesCtrl', function ($scope, $location, connection, uuid2, $timeout, gettextCatalog) {
    connection.get('/api/company/get-company-data').then(result => {
        $scope.data = result.items.sharedSpace;
    });

    $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;

        if (typeof nodeData === 'undefined') {
            $scope.data.push({
                id: uuid2.newguid(),
                title: 'my folder',
                nodes: []
            });
        } else {
            nodeData.nodes.push({
                id: uuid2.newguid(),
                title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                nodes: []
            });
        }
    };

    $scope.save = function () {
        connection.post('/api/company/save-public-space', $scope.data);
    };

    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };
});
