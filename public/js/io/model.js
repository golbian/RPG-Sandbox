angular.module('app').service('ioModel', function (connection, $q, gettextCatalog) {
    function exportDatasource (datasourceID) {
        return connection.get('/api/data-sources/find-one', { id: datasourceID })
            .then(response => response.item);
    }

    function exportLayer (layerID) {
        return connection.get('/api/layers/find-one', { id: layerID })
            .then(response => response.item);
    }

    function exportMap (mapID) {
        return connection.get('/api/maps/find-one', { id: mapID })
            .then(response => {
                delete response.item.query.data;
                return response.item;
            });
    }

    function exportGame (gameID) {
        return connection.get('/api/gamesv2/find-one', { id: gameID })
            .then(response => {
                for (const map of response.item.maps) {
                    delete map.query.data;
                }
                return response.item;
            });
    }

    this.makeExportBundle = function (gameIDs, mapIDs, layerIDs) {
        const requiredLayers = new Set();
        const requiredDatasources = new Set();
        const bundle = {};

        for (const layerID of layerIDs) {
            requiredLayers.add(layerID);
        }

        const mapPromise = Promise.all(mapIDs.map(id => exportMap(id)))
            .then(maps => {
                bundle.maps = maps;
                for (const map of maps) {
                    requiredLayers.add(map.query.layerID);
                }
            });

        const gamePromise = Promise.all(gameIDs.map(id => exportGame(id)))
            .then(games => {
                bundle.games = games;
                for (const game of games) {
                    for (const map of game.maps) {
                        requiredLayers.add(map.query.layerID);
                    }
                }
            });

        return Promise.all([mapPromise, gamePromise])
            .then(() => {
                return Promise.all(Array.from(requiredLayers).map(layerID => exportLayer(layerID)));
            })
            .then(layers => {
                bundle.layers = layers;
                for (const layer of layers) {
                    requiredDatasources.add(layer.datasourceID);
                }
            })
            .then(() => {
                return Promise.all(Array.from(requiredDatasources).map(id => exportDatasource(id)));
            })
            .then(datasources => {
                bundle.datasources = datasources;
            })
            .then(() => {
                return bundle;
            });
    };

    function importLayer (layer, datasourceRef) {
        let currentDatasourceID = layer.datasourceID;

        // If not defined, search in layer.params.schema
        // It might be an export from a previous version of Urungi
        if (!currentDatasourceID && layer.params && layer.params.schema && layer.params.schema.length > 0) {
            currentDatasourceID = layer.params.schema[0].datasourceID;
        }

        if (!currentDatasourceID) {
            return $q.reject(new Error('Cannot find datasourceID in layer ' + layer.name));
        }

        if (!(currentDatasourceID in datasourceRef)) {
            return $q.reject(new Error('Cannot find mapping for datasource ' + currentDatasourceID));
        }

        layer.datasourceID = datasourceRef[currentDatasourceID];

        return connection.post('/api/layers/create', layer);
    }

    function importMap (map) {
        return connection.post('/api/maps/create', map);
    }

    function importGame (game, datasourceRef) {
        return connection.post('/api/gamesv2/create', game);
    }

    this.importBundle = function (bundle, datasourceRef) {
        const additions = [];
        const messages = [];
        const replace = [];

        const layerPromises = [];
        for (const layer of bundle.layers) {
            const p = getLayer(layer._id).then(l => {
                if (l) {
                    if (layer.replace === true) {
                        var msg = gettextCatalog.getString('This layer was replaced:') + ' ';
                        messages.push(msg + l.name);
                        return this.replaceLayer(layer).then(function () {
                            replace.push(layer);
                        });
                    } else {
                        msg = gettextCatalog.getString('Layer was not imported because it already exists in database:') + ' ';
                        messages.push(msg + l.name);
                        return;
                    }
                }

                return importLayer(layer, datasourceRef).then(l => {
                    additions.push(l);
                }).catch(err => {
                    const msg = gettextCatalog.getString('Layer was not imported :');
                    messages.push(msg + ' ' + err);
                });
            });
            layerPromises.push(p);
        }

        return $q.all(layerPromises).then(() => {
            const promises = [];
            for (const map of bundle.maps) {
                const p = getMap(map._id).then(r => {
                    if (r) {
                        if (map.replace === true) {
                            var msg = gettextCatalog.getString('This map was replaced:') + ' ';
                            messages.push(msg + r.mapName);
                            return this.replaceMap(map).then(function () {
                                replace.push(map);
                            });
                        }
                        msg = gettextCatalog.getString('Map was not imported because it already exists in database:') + ' ';
                        messages.push(msg + r.mapName);
                        return;
                    }

                    return importMap(map).then(r => {
                        additions.push(r);
                    });
                });
                promises.push(p);
            }

            for (const game of bundle.games) {
                const p = getGame(game._id).then(d => {
                    if (d) {
                        if (game.replace === true) {
                            var msg = gettextCatalog.getString('This game was replaced:') + ' ';
                            messages.push(msg + d.gameName);
                            return this.replaceGame(game).then(function () {
                                replace.push(game);
                            });
                        }
                        msg = gettextCatalog.getString('Game was not imported because it already exists in database:') + ' ';
                        messages.push(msg + d.gameName);
                        return;
                    }

                    return importGame(game, datasourceRef).then(d => {
                        additions.push(d);
                    });
                });
                promises.push(p);
            }

            return $q.all(promises).then(() => {
                return {
                    additions: additions,
                    messages: messages,
                    replace: replace,
                };
            });
        });
    };

    this.getDataSources = function () {
        const params = {
            fields: ['_id', 'name']
        };

        return connection.get('/api/data-sources/find-all', params).then(r => r.items);
    };

    function getLayer (id) {
        return connection.get('/api/layers/find-one', { id: id }, { showMsg: false }).then(r => r.item);
    }

    this.getLayers = function () {
        var params = {
            fields: ['_id', 'name']
        };

        return connection.get('/api/layers/find-all', params).then(r => r.items);
    };

    function getMap (id) {
        return connection.get('/api/maps/find-one', { id: id }, { showMsg: false }).then(r => r.item);
    }

    this.getMaps = function () {
        var params = {
            fields: ['_id', 'mapName']
        };

        return connection.get('/api/maps/find-all', params).then(r => r.items);
    };

    function getGame (id) {
        return connection.get('/api/gamesv2/find-one', { id: id }, { showMsg: false }).then(r => r.item);
    }

    this.getGames = function () {
        var params = {
            fields: ['_id', 'gameName']
        };

        return connection.get('/api/gamesv2/find-all', params).then(r => r.items);
    };

    this.replaceLayer = function (layer) {
        return connection.post('/api/layers/update/' + layer._id, layer).then(l => l.item);
    };

    this.replaceMap = function (map) {
        return connection.post('/api/maps/update/' + map._id, map).then(r => r.item);
    };

    this.replaceGame = function (game) {
        return connection.post('/api/gamesv2/update/' + game._id, game).then(d => d.item);
    };
});
