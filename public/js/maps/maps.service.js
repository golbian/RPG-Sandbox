(function () {
    'use strict';

    angular.module('app.maps').factory('mapsService', mapsService);

    mapsService.$inject = [];

    function mapsService () {
        let storedMap = {};
        const service = {
            storeMap: storeMap,
            getStoredMap: getStoredMap,
        };

       return service;

     }

       function storeMap (map) {
            storedMap = map;
        }

        function getStoredMap () {
            return storedMap;
        }
})();
