angular.module('app').service('mapModel', function ($q, connection, FileSaver) {
    this.getMapDefinition = function (id, isLinked) {
        const url = '/api/maps/get-map/' + id;
        const params = { id: id, mode: 'edit', linked: isLinked };

        return connection.get(url, params).then(function (data) {
            return data.item;
        });
    };


    function clone (obj) {
        if (!obj) { return obj; }
        if (Object.getPrototypeOf(obj) === Date.prototype) { return new Date(obj); }
        if (typeof obj !== 'object') { return obj; }
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    this.saveAsMap = function (map, mode) {

        // Cleaning up the map object
        // var clonedMap = clone(map);
        var clonedMap = map;
        if (clonedMap.properties) {
            clonedMap.properties = undefined;
        }
        clonedMap.parentDiv = undefined;

        let url;
        if (mode === 'add') {
            url = '/api/maps/create';
        } else {
            url = '/api/maps/update/' + map._id;
        }

        return connection.post(url, clonedMap);
    };

    this.duplicateMap = function (duplicateOptions) {
        const params = { id: duplicateOptions.map._id };
        return connection.get('/api/maps/find-one', params).then(function (result) {
            const newMap = result.item;
            console.log(newMap)

            delete newMap._id;
            delete newMap.createdOn;
            newMap.mapName = duplicateOptions.newName;

            return connection.post('/api/maps/create', newMap).then(function (data) {
                if (data.result !== 1) {
                    // TODO indicate error
                }
            });
        });
    };
});
