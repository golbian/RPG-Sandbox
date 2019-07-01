angular.module('app').directive('mapView', function ($q, $timeout, mapModel, $compile, c3Charts, mapHtmlWidgets, grid, verticalGrid, pivot, uuid2) {
    return {

        scope: {
            map: '=',
            mode: '='
        },

        link: function ($scope, element) {
            $scope.loading = false;
            $scope.loadingMessage = '';

            $scope.changeContent = function (newHtml) {
                var html = '<div class="map-view" ng-hide="loading" style="height:100%">';
                html += newHtml;
                html += '</div><div ng-show="loading" class="container-fluid" >';
                html += '<h3><img src="/images/loader.gif" width="32px" height="32px"/>{{loadingMessage}}</h3>';
                html += '</div>';

                element.html(html);
                $compile(element.contents())($scope);
            };

            $scope.$on('repaint', function (event, args) {
                $scope.loading = true;

                if (!args) {
                    args = {};
                }

                let promise = $q.resolve(0);

                if (args.fetchData && $scope.map.query) {
                    $scope.loadingMessage = 'Fetching data ...';
                    promise = mapModel.fetchData($scope.map.query, args).then(function (result) {
                        if (result.errorToken) {
                            $scope.errorToken = result.errorToken;
                        }
                    });
                }

                return promise.then(function () {
                    $scope.loadingMessage = 'Repainting map ...';

                    switch ($scope.map.mapType) {
                    case 'grid':
                        $scope.changeContent(grid.extendedGridV2($scope.map, $scope.mode));
                        break;
                    case 'vertical-grid':
                        $scope.changeContent(verticalGrid.getVerticalGrid($scope.map, $scope.mode));
                        break;
                    case 'pivot':
                        var result = pivot.getPivotTableSetup($scope.map);
                        $scope.changeContent(result.html);
                        $(result.jquerySelector).cypivot(result.params);
                        break;
                    case 'chart-line':
                    case 'chart-donut':
                    case 'chart-pie':
                    case 'gauge':
                        const id = 'CHART_' + $scope.map.id + '-' + uuid2.newuuid();
                        const html = c3Charts.getChartHTML($scope.map, $scope.mode, id);
                        $scope.changeContent(html);

                        // FIXME $timeout should not be necessary here, but
                        // without it the chart is shown and automatically
                        // replaced by an empty chart
                        return $timeout(function () {}, 0).then(function () {
                            mapModel.initChart($scope.map);
                            c3Charts.rebuildChart($scope.map, id);
                            $scope.loading = false;
                        });
                    case 'indicator':
                        $scope.changeContent(mapHtmlWidgets.generateIndicator($scope.map));
                        break;

                    default:
                        $scope.changeContent('<div style="width: 100%;height: 100%;display: flex;align-items: center;"><span style="color: darkgray; font-size: initial; width:100%;text-align: center";><img src="/images/empty.png">No data for this map</span></div>');
                    }

                    $scope.loading = false;
                });
            });

            $scope.$on('clearMap', function () {
                $scope.changeContent('<div class="container-fluid"  ng-show="loading" ><h3><img src="/images/loader.gif" width="32px" height="32px"/>{{loadingMessage}}</h3></div>');
                $scope.loading = false;
            });

            $scope.$on('showLoadingMessage', function (event, loadingMessage) {
                $scope.loading = true;
                $scope.loadingMessage = loadingMessage;
            });
        },

        template: '<div class="container-fluid"  ng-show="loading" ><h3><img src="/images/loader.gif" width="32px" height="32px"/>{{loadingMessage}}</h3></div>'

    };
});
