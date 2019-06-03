module.exports = function (app) {
    var Maps = require('./controller.js');

    /* Maps */
    app.get('/api/maps/find-all', restrict, Maps.MapsFindAll);
    app.get('/api/maps/find-one', restrict, Maps.MapsFindOne);
    app.post('/api/maps/create', restrict, Maps.MapsCreate);
    app.post('/api/maps/update/:id', restrict, Maps.MapsUpdate);
    app.post('/api/maps/delete/:id', restrict, Maps.MapsDelete);
    app.post('/api/maps/get-data', Maps.MapsGetData);
    app.get('/api/maps/get-map/:id', Maps.GetMap);
    app.post('/api/maps/publish-map', restrict, Maps.PublishMap);
    app.post('/api/maps/unpublish', restrict, Maps.UnpublishMap);
    app.post('/api/maps/share-map', restrict, Maps.ShareMap);
    app.post('/api/maps/unshare', restrict, Maps.UnshareMap);
};
