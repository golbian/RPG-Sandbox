var Maps = connection.model('Maps');

const Controller = require('../../core/controller.js');

class MapsController extends Controller {
    constructor () {
        super(Maps);
        this.searchFields = ['mapName'];
    }
}

var controller = new MapsController();

exports.MapsFindAll = async function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;
    req.user = {};
    req.user.companyID = 'COMPID';
    var perPage = config.get('pagination.itemsPerPage');
    var page = (req.query.page) ? req.query.page : 1;
    var result = controller.findAllParams(req);
    result = await controller.findAll(req);
    res.status(200).json(result);
};

exports.GetMap = function (req, res) {
    req.query.trash = true;

    controller.findOne(req).then(function (result) {
        if (!result.item || (!result.item.isPublic && !req.isAuthenticated())) {
            return res.status(403).send('Forbidden');
        }

        res.status(200).json(result);
        if ((req.query.mode === 'execute' || req.query.mode === 'preview') && result.item) {
            // Note the execution in statistics
            var statistics = connection.model('statistics');
            var stat = {};
            stat.type = 'map';
            stat.relationedID = result.item._id;
            stat.relationedName = result.item.mapName;

            if (req.query.linked === true) {
                stat.action = 'execute link';
            } else {
                stat.action = 'execute';
            }
            statistics.save(req, stat);
        }
    });
};

exports.MapsFindOne = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;

    controller.findOne(req).then(function (result) {
        res.status(200).json(result);
    });
};

exports.MapsCreate = function (req, res) {
    if (!req.session.mapsCreate && !req.session.isWSTADMIN) {
        res.status(401).json({ result: 0, msg: 'You do not have permissions to create maps' });
    } else {
        req.query.trash = true;
        req.query.companyid = true;
        req.query.userid = true;

        req.body.owner = req.user._id;
        req.body.isPublic = false;
        req.body.isShared = false;
        req.body.author = req.user.userName;

        controller.create(req).then(function (result) {
            res.status(200).json(result);
        });
    }
};

exports.MapsUpdate = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;
    req.query.properties = true;
    var data = req.body;

    if (!req.session.isWSTADMIN) {
        var Maps = connection.model('Maps');
        Maps.findOne({ _id: data._id, owner: req.user._id, companyID: req.user.companyID }, { _id: 1 }, {}, function (err, item) {
            if (err) throw err;
            if (item) {
                controller.update(req).then(function (result) {
                    res.status(200).json(result);
                });
            } else {
                res.status(401).json({ result: 0, msg: 'You don´t have permissions to update this map, or this map do not exists' });
            }
        });
    } else {
        controller.update(req).then(function (result) {
            res.status(200).json(result);
        });
    }
};

exports.PublishMap = async function (req, res) {
    const map = await getMapFromRequest(req);
    if (map) {
        map.publish().then(() => {
            res.status(200).json({ result: 1, msg: 'Map published' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error publishing map' });
        });
    } else {
        res.status(404).json({ result: 0, msg: 'This map does not exist' });
    }
};

exports.UnpublishMap = async function (req, res) {
    const map = await getMapFromRequest(req);
    if (map) {
        map.unpublish().then(() => {
            res.status(200).json({ result: 1, msg: 'Map unpublished' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error unpublishing map' });
        });
    } else {
        res.status(404).json({ result: 0, msg: 'This map does not exist' });
    }
};

exports.ShareMap = async function (req, res) {
    const map = await getMapFromRequest(req);
    if (map) {
        map.share(req.body.parentFolder).then(() => {
            res.status(200).json({ result: 1, msg: 'Map shared' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error sharing map' });
        });
    } else {
        res.status(404).json({ result: 0, msg: 'This map does not exist' });
    }
};

exports.UnshareMap = async function (req, res) {
    const map = await getMapFromRequest(req);
    if (map) {
        map.unshare().then(() => {
            res.status(200).json({ result: 1, msg: 'Map unshared' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error unsharing map' });
        });
    } else {
        res.status(404).json({ result: 0, msg: 'This map does not exist' });
    }
};

exports.MapsDelete = async function (req, res) {
    const map = await getMapFromRequest(req);
    if (map) {
        map.remove().then(() => {
            res.status(200).json({ result: 1, msg: 'Map deleted' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error deleting map' });
        });
    } else {
        res.status(404).json({ result: 0, msg: 'This map does not exist' });
    }
};

exports.MapsGetData = async function (req, res) {
    var data = req.body;
    var query = data.query;
    // processDataSources(req, query.datasources, query.layers, {page: (data.page) ? data.page : 1}, query, function (result) {
    //     res.status(200).json(result);
    // });
    var result;
    try {
        result = await QueryProcessor.execute(query);
    } catch (err) {
        console.error(err);
        result = { result: 0, msg: (err.msg) ? err.msg : String(err), error: err };
    }
    res.status(200).json(result);
};

function getMapFromRequest (req) {
    const conditions = {
        _id: req.body._id || req.body.id,
    };

    if (!req.session.isWSTADMIN) {
        conditions.owner = req.user._id;
    }

    return Maps.findOne(conditions);
}
