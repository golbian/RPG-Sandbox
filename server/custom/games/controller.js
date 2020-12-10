const mongoose = require("mongoose")
var Games = mongoose.model('Games');

const Controller = require('../../core/controller.js');

class GamesController extends Controller {
    constructor () {
        super(Games);
        this.searchFields = [];
    }
}

var controller = new GamesController();

exports.GamesFindAll = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;

    req.query.fields = ['gameName'];

    var perPage = config.get('pagination.itemsPerPage');
    var page = (req.query.page) ? req.query.page : 1;
    /*
     if (isWSTADMIN)
     var find = {"$and":[{"nd_trash_deleted":false},{"companyID":"COMPID"}]}
     else */
    var find = { '$and': [{ 'nd_trash_deleted': false }, { 'companyID': 'COMPID' }, { owner: req.user._id }] };
    // var find = {"$and":[{"nd_trash_deleted":false},{"companyID":"COMPID"},{"$or": [{owner: req.user._id},{owner: { $exists: false }}]}]}
    var fields = { gameName: 1, owner: 1, isPublic: 1 };
    var params = {};

    var Games = connection.model('Games');
    Games.find(find, fields, params, function (err, items) {
        if (err) throw err;

        Games.count(find, function (err, count) {
            if (err) throw err;

            var result = { result: 1, page: page, pages: ((req.query.page) ? Math.ceil(count / perPage) : 1), items: items };
            res.status(200).json(result);
        });
    });
};

exports.GamesFindOne = function (req, res) {
    // TODO: Tienes permisos para ejecutar el game

    req.query.trash = true;
    req.query.companyid = true;

    controller.findOne(req, function (result) {
        res.status(200).json(result);
    });
};

exports.GamesCreate = function (req, res) {
    if (!req.session.gamesCreate && !req.session.isWSTADMIN) {
        res.status(401).json({ result: 0, msg: 'You don´t have permissions to create games' });
    } else {
        req.query.trash = true;
        req.query.companyid = true;
        req.query.userid = true;

        req.body.owner = req.user._id;
        req.body.isPublic = false;

        req.body.author = req.user.userName;

        controller.create(req, function (result) {
            res.status(200).json(result);
        });
    }
};

exports.GamesUpdate = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;

    var data = req.body;

    if (!req.session.isWSTADMIN) {
        var Games = connection.model('Games');
        Games.findOne({ _id: data._id, owner: req.user._id }, { _id: 1 }, {}, function (err, item) {
            if (err) throw err;
            if (item) {
                controller.update(req, function (result) {
                    res.status(200).json(result);
                });
            } else {
                res.status(401).json({ result: 0, msg: 'You don´t have permissions to update this game' });
            }
        });
    } else {
        controller.update(req, function (result) {
            res.status(200).json(result);
        });
    }
};

exports.GamesDelete = function (req, res) {
    var data = req.body;

    req.query.trash = true;
    req.query.companyid = true;

    data._id = data.id;
    data.nd_trash_deleted = true;
    data.nd_trash_deleted_date = new Date();

    req.body = data;

    if (!req.session.isWSTADMIN) {
        var Games = connection.model('Games');
        Games.findOne({ _id: data._id, owner: req.user._id }, { _id: 1 }, {}, function (err, item) {
            if (err) throw err;
            if (item) {
                controller.update(req, function (result) {
                    res.status(200).json(result);
                });
            } else {
                res.status(401).json({ result: 0, msg: 'You don´t have permissions to delete this game' });
            }
        });
    } else {
        controller.update(req, function (result) {
            res.status(200).json(result);
        });
    }
};

exports.getGame = function (req, res) {
    req.query.trash = true;
    var theMaps = [];

    // TODO: permissions to execute

    controller.findOne(req, function (result) {
        // identify maps of the game...

        if (result) {
            // Annotate the execution in statistics

            var statistics = connection.model('statistics');
            var stat = {};
            stat.type = 'game';
            stat.relationedID = result.item._id;
            stat.relationedName = result.item.gameName;
            if (req.query.linked) { stat.action = 'execute link'; } else { stat.action = 'execute'; }
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

exports.PublishGame = function (req, res) {
    var data = req.body;

    // tiene el usuario conectado permisos para publicar?
    var Games = connection.model('Games');
    var find = { _id: data._id, owner: req.user._id, companyID: req.user.companyID };

    if (req.session.isWSTADMIN) { find = { _id: data._id, companyID: req.user.companyID }; }

    Games.findOne(find, {}, {}, function (err, Game) {
        if (err) throw err;
        if (Game) {
            Game.isPublic = true;

            Games.update({ _id: data._id }, { $set: Game.toObject() }, function (err, numAffected) {
                if (err) throw err;

                if (numAffected > 0) {
                    res.status(200).json({ result: 1, msg: numAffected + ' game published.' });
                } else {
                    res.status(200).json({ result: 0, msg: 'Error publishing game, no game have been published' });
                }
            });
        } else {
            res.status(401).json({ result: 0, msg: 'You don´t have permissions to publish this game, or this game do not exists' });
        }
    });
};

exports.UnpublishGame = function (req, res) {
    var data = req.body;

    // TODO:tiene el usuario conectado permisos para publicar?
    var Games = connection.model('Games');
    var find = { _id: data._id, owner: req.user._id, companyID: req.user.companyID };

    if (req.session.isWSTADMIN) { find = { _id: data._id, companyID: req.user.companyID }; }

    Games.findOne(find, {}, {}, function (err, Game) {
        if (err) throw err;
        if (Game) {
            Game.isPublic = false;
            Games.update({ _id: data._id }, { $set: Game.toObject() }, function (err, numAffected) {
                if (err) throw err;

                if (numAffected > 0) {
                    res.status(200).json({ result: 1, msg: numAffected + ' game unpublished.' });
                } else {
                    res.status(200).json({ result: 0, msg: 'Error unpublishing game, no game have been unpublished' });
                }
            });
        } else {
            res.status(401).json({ result: 0, msg: 'You don´t have permissions to unpublish this game, or this game do not exists' });
        }
    });
};

exports.ShareGame = function (req, res) {
    var data = req.body;
    var parentFolder = data.parentFolder;

    // tiene el usuario conectado permisos para publicar?
    var Games = connection.model('Games');
    var find = { _id: data._id, owner: req.user._id, companyID: req.user.companyID };

    if (req.session.isWSTADMIN) { find = { _id: data._id, companyID: req.user.companyID }; }

    Games.findOne(find, {}, {}, function (err, Game) {
        if (err) throw err;
        if (Game) {
            Game.parentFolder = parentFolder;
            Game.isShared = true;

            Games.update({ _id: data._id }, { $set: Game.toObject() }, function (err, numAffected) {
                if (err) throw err;

                if (numAffected > 0) {
                    res.status(200).json({ result: 1, msg: numAffected + ' game shared.' });
                } else {
                    res.status(200).json({ result: 0, msg: 'Error sharing game, no game have been shared' });
                }
            });
        } else {
            res.status(401).json({ result: 0, msg: 'You don´t have permissions to shared this game, or this game do not exists' });
        }
    });
};

exports.UnshareGame = function (req, res) {
    var data = req.body;

    // TODO:tiene el usuario conectado permisos para publicar?
    var Games = connection.model('Games');
    var find = { _id: data._id, owner: req.user._id, companyID: req.user.companyID };

    if (req.session.isWSTADMIN) { find = { _id: data._id, companyID: req.user.companyID }; }

    Games.findOne(find, {}, {}, function (err, Game) {
        if (err) throw err;
        if (Game) {
            Game.isShared = false;
            Games.update({ _id: data._id }, { $set: Game.toObject() }, function (err, numAffected) {
                if (err) throw err;

                if (numAffected > 0) {
                    res.status(200).json({ result: 1, msg: numAffected + ' game unshared.' });
                } else {
                    res.status(200).json({ result: 0, msg: 'Error unsharing game, no game have been unshared' });
                }
            });
        } else {
            res.status(401).json({ result: 0, msg: 'You don´t have permissions to unshared this game, or this game do not exists' });
        }
    });
};
