(function () {
    'use strict';

    angular.module('app.games').controller('GamesViewController', GamesViewController);

    GamesViewController.$inject = ['$scope', '$timeout', '$compile', 'game'];

    function GamesViewController ($scope, $timeout, $compile, game) {
        const vm = this;

        vm.mode = 'preview';
        vm.prompts = {};
        vm.game = game;
        vm.getMap = getMap;
        vm.promptChanged = promptChanged;
        vm.getQueryForFilter = getQueryForFilter;

        activate();

        function activate () {
            loadHTML();
        }

        function getMap (mapID) {
            return vm.game.maps.find(r => r.id === mapID);
        }


        function loadHTML () {
            const pageViewer = document.getElementById('pageViewer');
            pageViewer.insertAdjacentHTML('beforeend', vm.game.html);

            if (vm.game.properties.rootStyle) {
                pageViewer.setAttribute('style', vm.game.properties.rootStyle);
            }

            document.querySelectorAll('[map-view]').forEach(mapView => {
                const mapAttr = mapView.getAttribute('map');
                mapView.setAttribute('map', 'vm.' + mapAttr);
            });


            $compile(pageViewer)($scope);


    }
  }
})();
