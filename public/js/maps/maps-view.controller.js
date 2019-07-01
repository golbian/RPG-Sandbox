(function () {
    'use strict';

    angular.module('app.maps').controller('MapsViewController', MapsViewController);

    MapsViewController.$inject = ['$scope', '$timeout', 'mapsService', 'xlsxService', 'map'];

    function MapsViewController ($scope, $timeout, mapsService, xlsxService, map) {
        const vm = this;
        vm.map = map;
        vm.prompts = {};
        vm.getPrompts = getPrompts;
        vm.repaintWithPrompts = repaintWithPrompts;
        vm.getQueryForFilter = getQueryForFilter;
        vm.saveAsXLSX = saveAsXLSX;

    }
})();
