angular.module('app').service('mapModel', function ($q, connection, FileSaver) {
    this.getMapDefinition = function (id, isLinked) {
        const url = '/api/maps/get-map/' + id;
        const params = { id: id, mode: 'preview', linked: isLinked };

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
        // Is this necessary ? It causes c3 to crash, so I will remove it until I find a reason for it
        var clonedMap = map;
        if (clonedMap.properties.chart) {
            clonedMap.properties.chart.chartCanvas = undefined;
            clonedMap.properties.chart.data = undefined;
            // clonedMap.properties.chart.query = undefined;
        }
        if (clonedMap.query.data) { clonedMap.query.data = undefined; }
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

    this.getMapContainerHTML = function (mapID) {
        // returns a container for the map, to be inserted in the game html

        var containerID = 'MAP_CONTAINER_' + mapID;

        var html = '<div page-block  class="container-fluid featurette ndContainer"  ndType="container" style="height:100%;padding:0px;">' +
                        '<div page-block class="col-md-12 ndContainer" ndType="column" style="height:100%;padding:0px;">' +
                            '<div page-block class="container-fluid" id="' + containerID +
                             '" map-view map="getMap(\'' + mapID + '\')" style="padding:0px;position: relative;height: 100%;font-size:30px;"></div>' +
                        '</div>' +
                    '</div>';

        return html;
    };
});
