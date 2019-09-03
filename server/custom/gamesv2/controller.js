const Gamesv2 = connection.model('Gamesv2');

const Controller = require('../../core/controller.js');

class Gamesv2Controller extends Controller {
    constructor () {
        super(Gamesv2);
        this.searchFields = [];
    }
}

var controller = new Gamesv2Controller();

exports.Gamesv2FindAll = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;
    req.user = {};
    req.user.companyID = 'COMPID';
    controller.findAll(req).then(function (result) {
        res.status(200).json(result);
    });
};

exports.Gamesv2FindOne = function (req, res) {
    // TODO: Are you granted to execute this Game???

    req.query.trash = true;
    req.query.companyid = true;

    controller.findOne(req).then(function (result) {
        res.status(200).json(result);
    });
};

exports.Gamesv2Create = function (req, res) {
    if (!req.session.Gamesv2Create && !req.session.isWSTADMIN) {
        res.status(401).json({ result: 0, msg: 'You don´t have permissions to create Games' });
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

exports.Gamesv2Duplicate = function (req, res) {
    if (!req.session.Gamesv2Create && !req.session.isWSTADMIN) {
        res.status(401).json({ result: 0, msg: 'You don´t have permissions to create Gamesv2' });
    } else {
        req.query.trash = true;
        req.query.companyid = true;
        req.query.userid = true;

        delete (req.body._id);
        req.body.gameName = 'Copy of ' + req.body.gameName;
        req.body.owner = req.user._id;
        req.body.isPublic = false;
        req.body.isShared = false;
        req.body.parentFolder = undefined;
        controller.create(req).then(function (result) {
            res.status(200).json(result);
        });
    }
};

exports.Gamesv2Update = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;

    var data = req.body;

    if (!req.session.isWSTADMIN) {
        Gamesv2.findOne({ _id: data._id, owner: req.user._id }, { _id: 1 }, {}, function (err, item) {
            if (err) throw err;
            if (item) {
                controller.update(req).then(function (result) {
                    res.status(200).json(result);
                });
            } else {
                res.status(401).json({ result: 0, msg: 'You don´t have permissions to update this Game' });
            }
        });
    } else {
        controller.update(req).then(function (result) {
            res.status(200).json(result);
        });
    }
};

exports.Gamesv2Delete = async function (req, res) {
    const game = await getGameFromRequest(req);
    if (game) {
        game.nd_trash_deleted = true;
        game.nd_trash_deleted_date = new Date();

        game.remove().then(() => {
            res.status(200).json({ result: 1, msg: 'Game deleted' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error deleting game' });
        });
    } else {
        res.status(404).json({
            result: 0,
            msg: 'This game does not exist',
        });
    }
};

exports.getGame = function (req, res) {
    req.query.trash = true;
    var theMaps = [];

    // TODO: permissions to execute

    controller.findOne(req).then(function (result) {
        if (!result.item || (!result.item.isPublic && !req.isAuthenticated())) {
            return res.status(403).send('Forbidden');
        }
        // identify maps of the Game...

        if (result) {
            // Annotate the execution in statistics
            var statistics = connection.model('statistics');
            var stat = {};
            stat.type = 'Game';
            stat.relationedID = result.item._id;
            stat.relationedName = result.item.gameName;
            stat.action = 'execute';
            statistics.save(req, stat, function () {

            });

            for (var r in result.item.items) {
                if (result.item.items[r].itemType === 'mapBlock') {
                    theMaps.push(result.item.items[r].mapID);
                }
                if (result.item.items[r].itemType === 'tabBlock') {
                    // $scope.getTabBlock(result.item.items[r]);
                }
            }

            // Get all the maps...
            var Maps = connection.model('Maps');

            Maps.find({ _id: { $in: theMaps } }, function (err, maps) {
                if (err) { console.error(err); }

                if (maps) {
                    for (var r in maps) {
                        for (var i in result.item.items) {
                            if (maps[r]._id === result.item.items[i].mapID) {
                                result.item.items[i].mapDefinition = maps[r];
                            }
                        }
                    }

                    res.status(200).json(result);
                } else {
                // TODO: NO REPORTS FOUND
                }
            });
        } else {
            // TODO: NO DASHBOARD FOUND
        }
    });
};

exports.PublishGame = async function (req, res) {
    // TODO: Check if the connected user has the permission to publish
    const game = await getGameFromRequest(req);
    if (game) {
        game.publish().then(() => {
            res.status(200).json({ result: 1, msg: 'Game published' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error publishing game' });
        });
    } else {
        res.status(404).json({
            result: 0,
            msg: 'This game does not exist',
        });
    }
};

exports.UnpublishGame = async function (req, res) {
    // TODO: Check if logged in user has the permission to publish
    const game = await getGameFromRequest(req);
    if (game) {
        game.unpublish().then(() => {
            res.status(200).json({ result: 1, msg: 'Game unpublished' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error unpublishing game' });
        });
    } else {
        res.status(404).json({
            result: 0,
            msg: 'This game does not exist',
        });
    }
};

exports.ShareGame = async function (req, res) {
    // TODO: Check if the connected user has the permission to share
    const game = await getGameFromRequest(req);
    if (game) {
        game.share(req.body.parentFolder).then(() => {
            res.status(200).json({ result: 1, msg: 'Game shared' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error sharing game' });
        });
    } else {
        res.status(404).json({
            result: 0,
            msg: 'This game does not exist',
        });
    }
};

exports.UnshareGame = async function (req, res) {
    // TODO: Check if logged in user has the permission to share
    const game = await getGameFromRequest(req);
    if (game) {
        game.unshare().then(() => {
            res.status(200).json({ result: 1, msg: 'Game unshared' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error unsharing game' });
        });
    } else {
        res.status(404).json({
            result: 0,
            msg: 'This game does not exist',
        });
    }
};

function getGameFromRequest (req) {
    const conditions = {
        _id: req.body._id || req.body.id,
        companyID: req.user.companyID,
    };

    if (!req.session.isWSTADMIN) {
        conditions.owner = req.user._id;
    }

    return Gamesv2.findOne(conditions).exec();
}
