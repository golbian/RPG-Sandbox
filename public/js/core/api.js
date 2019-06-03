(function () {
    'use strict';

    angular.module('app.core').factory('api', api);

    api.$inject = ['connection'];

    function api (connection) {
        const service = {
            getCounts: getCounts,
            getUserData: getUserData,
            getUserObjects: getUserObjects,

            mapsFindAll: mapsFindAll,
            deleteMap: deleteMap,
            publishMap: publishMap,
            unpublishMap: unpublishMap,
            shareMap: shareMap,
            unshareMap: unshareMap,

            gamesFindAll: gamesFindAll,
            deleteGame: deleteGame,
            getGame: getGame,
            publishGame: publishGame,
            unpublishGame: unpublishGame,
            shareGame: shareGame,
            unshareGame: unshareGame,

            layersFindAll: layersFindAll,
            changeLayerStatus: changeLayerStatus,
            createLayer: createLayer,
            deleteLayer: deleteLayer,
        };

        return service;

        function getCounts () {
            return connection.get('/api/get-counts');
        }

        function getUserData () {
            return connection.get('/api/get-user-data');
        }

        function getUserObjects () {
            return connection.get('/api/get-user-objects').then(res => res.items);
        }

        function getDataSources (params) {
            return connection.get('/api/data-sources/find-all', params);
        }

        function getEntitiesSchema (dataSourceID, entity) {
            var params = {
                datasourceID: dataSourceID,
                entity: entity,
            };

            return connection.get('/api/data-sources/getEntitySchema', params);
        }

        function getSqlQuerySchema (dataSourceID, collection) {
            var params = {
                datasourceID: dataSourceID,
                collection: collection,
            };

            return connection.get('/api/data-sources/getsqlQuerySchema', params);
        }

        function mapsFindAll (params) {
            return connection.get('/api/maps/find-all', params);
        }

        function deleteMap (id) {
            return connection.post('/api/maps/delete/' + id, { id: id });
        }

        function publishMap (id) {
            const data = {
                id: id,
            };

            return connection.post('/api/maps/publish-map', data);
        }

        function unpublishMap (id) {
            const data = {
                id: id,
            };

            return connection.post('/api/maps/unpublish', data);
        }

        function shareMap (id, folderID) {
            const data = {
                id: id,
                parentFolder: folderID,
            };

            return connection.post('/api/maps/share-map', data);
        }

        function unshareMap (id) {
            const data = {
                id: id,
            };

            return connection.post('/api/maps/unshare', data);
        }

        function gamesFindAll (params) {
            return connection.get('/api/gamesv2/find-all', params);
        }

        function deleteGame (id) {
            return connection.post('/api/gamesv2/delete/' + id, { id: id });
        }

        function getGame (id) {
            const data = {
                id: id,
            };

            return connection.get('/api/gamesv2/get/' + id, data).then(res => res.item);
        }

        function publishGame (id) {
            const data = {
                id: id,
            };

            return connection.post('/api/gamesv2/publish-page', data);
        }

        function unpublishGame (id) {
            const data = {
                id: id,
            };

            return connection.post('/api/gamesv2/unpublish', data);
        }

        function shareGame (id, folderID) {
            const data = {
                id: id,
                parentFolder: folderID,
            };

            return connection.post('/api/gamesv2/share-page', data);
        }

        function unshareGame (id) {
            const data = {
                id: id,
            };

            return connection.post('/api/gamesv2/unshare', data);
        }
    }
})();
