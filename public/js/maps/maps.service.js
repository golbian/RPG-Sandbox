(function () {
    'use strict';

    angular.module('app').factory('mapsService', mapsService);

    mapsService.$inject = [];

    function mapsService () {
        let storedMap = {};
        const service = {
            generateQuery: generateQuery,
            storeMap: storeMap,
            getStoredMap: getStoredMap,
        };

       return service;

     function generateQuery (map) {
           const query = {};

           query.properties = map.properties;

           return query
         }

       function storeMap (map) {
            storedMap = map;
        }

        function getStoredMap () {
            return storedMap;
        }
    }
})();
