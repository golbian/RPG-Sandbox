var Users = connection.model('Users');
const Games = connection.model('Games');
const Controller = require('../../core/controller.js');

class UsersController extends Controller {
    constructor () {
        super(Users);
        this.searchFields = ['userName'];
    }
}

var controller = new UsersController();

exports.UsersCreate = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;
    req.body.companyID = 'COMPID';

    // Do we have to generate a password?
    if (req.body.sendPassword) {
        var generatePassword = require('password-generator');
        var thePassword = generatePassword();
        req.body.pwd1 = thePassword;
        req.body.userPassword = thePassword;
    }

    req.body.status = 'active';
    req.body.nd_trash_deleted = false;

    var Users = connection.model('Users');
    Users.createTheUser(req, res, req.body, function (result) {
        if (req.body.sendPassword && typeof thePassword !== 'undefined') {
            var recipients = [];
            recipients.push(req.body);
            sendEmailTemplate('newUserAndPassword', recipients, 'email', 'welcome to RPG-Sandbox');
        }

        res.status(200).json(result);
    });
};

exports.UsersUpdate = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;

    if (req.body.pwd1 && req.body.pwd2) {
        if (req.body.pwd1 === req.body.pwd2) {
            var hash = require('../../util/hash');
            hash(req.body.pwd1, function (err, salt, hash) {
                if (err) throw err;
                req.body.password = '';
                req.body.salt = salt;
                req.body.hash = hash;
                controller.update(req).then(function (result) {
                    res.status(200).json(result);
                });
            });
        } else {
            var result = {result: 0, msg: 'Passwords do not match'};
            res.status(200).json(result);
        }
    } else {
        controller.update(req).then(function (result) {
            res.status(200).json(result);
        });
    }
};

exports.UsersDelete = function (req, res) {
    req.query.trash = true;
    controller.remove(req).then(function (result) {
        res.status(200).json(result);
    });
};

exports.UsersFindAll = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;

    controller.findAll(req).then(function (result) {
        res.status(200).json(result);
    });
};

exports.UsersFindOne = function (req, res) {
    req.query.companyid = true;

    controller.findOne(req).then(function (result) {
        res.status(200).json(result);
    });
};

exports.logout = function (req, res) {
    req.logOut();
    res.clearCookie('remember_me');
    req.session.loggedIn = false;
    req.session = null;
    res.end();
};

exports.changeMyPassword = function (req, res) {
    if (req.body.pwd1 && req.body.pwd2) {
        if (req.body.pwd1 === req.body.pwd2) {
            var hash = require('../../util/hash');
            hash(req.body.pwd1, function (err, salt, hash) {
                if (err) throw err;
                Users.update({_id: req.user._id}, {salt: salt, hash: hash}, function (err) {
                    if (err) { console.error(err); }

                    const result = {result: 1, msg: 'Password changed'};
                    res.status(200).json(result);
                });
            });
        } else {
            const result = {result: 0, msg: 'Passwords do not match'};
            res.status(200).json(result);
        }
    }
};

exports.changeUserStatus = function (req, res) {
    Users.setStatus(req, function (result) {
        res.status(200).json(result);
    });
};

exports.setViewedContextHelp = function (req, res) {
    Users.setViewedContextHelp(req, function (result) {
        res.status(200).json(result);
    });
};

exports.getCounts = function (req, res) {
    var companyID = req.user.companyID;
    var theCounts = {};

    // Only for WSTADMIN - these counts are only for the WSTADMIN role
    var isWSTADMIN = false;

    if (req.isAuthenticated()) {
        for (var i in req.user.roles) {
            if (req.user.roles[i] === 'WSTADMIN') {
                isWSTADMIN = true;
            }
        }
    }

    if (isWSTADMIN) {
        // get all games
        var Games = connection.model('Games');
        Games.count({companyID: companyID, owner: req.user._id, nd_trash_deleted: false}, function (err, gamesCount) {
            if (err) { console.error(err); }

            theCounts.games = gamesCount;
            // get all maps
            var Maps = connection.model('Maps');
            Maps.count({companyID: companyID, owner: req.user._id, nd_trash_deleted: false}, function (err, mapsCount) {
                if (err) { console.error(err); }

                theCounts.maps = mapsCount;

                            // get all users
                            var Users = connection.model('Users');
                            Users.count({companyID: companyID, nd_trash_deleted: false}, function (err, usersCount) {
                                if (err) { console.error(err); }

                                theCounts.users = usersCount;
                        });
                    });
                });
    } else {
        // get all games
        var Games = connection.model('Games');
        Games.count({companyID: companyID, owner: req.user._id, nd_trash_deleted: false}, function (err, gameCount) {
            if (err) { console.error(err); }

            theCounts.games = gameCount;
            // get all maps
            var Maps = connection.model('Maps');
            Maps.count({companyID: companyID, owner: req.user._id, nd_trash_deleted: false}, function (err, mapCount) {
                if (err) { console.error(err); }

                theCounts.maps = mapCount;
            });
        });
    }
};

exports.getCountsForUser = function (req, res) {
    var userID = req.query.userID;
    var companyID = req.user.companyID;
    var theCounts = {};

    // get all games
    var Games = connection.model('Games');
    Games.count({companyID: companyID, owner: userID, isPublic: true, nd_trash_deleted: false}, function (err, gamesCount) {
        if (err) { console.error(err); }

        theCounts.publishedGames = gamesCount;
        // get all maps
        var Maps = connection.model('Maps');
        Maps.count({companyID: companyID, owner: userID, isPublic: true, nd_trash_deleted: false}, function (err, mapsCount) {
            if (err) { console.error(err); }

            theCounts.publishedMaps = mapsCount;

            Games.count({companyID: companyID, owner: userID, isPublic: false, nd_trash_deleted: false}, function (err, privateGamesCount) {
                if (err) { console.error(err); }

                theCounts.privateGames = privateGamesCount;

                var Maps = connection.model('Maps');
                Maps.count({companyID: companyID, owner: userID, isPublic: false, nd_trash_deleted: false}, function (err, privateMapsCount) {
                    if (err) { console.error(err); }

                    theCounts.privateMaps = privateMapsCount;
                    res.status(200).json(theCounts);
                });
            });
        });
    });
};

exports.getUserGames = function (req, res) {
    var page = (req.query.page) ? req.query.page : 1;
    var userID = req.query.userID;
    var companyID = req.user.companyID;
    var Games = connection.model('Games');
    Games.find({companyID: companyID, owner: userID, nd_trash_deleted: false}, {gameName: 1, parentFolder: 1, isPublic: 1, gameDescription: 1, status: 1}, function (err, games) {
        if (err) { console.error(err); }

        res.status(200).json({result: 1, page: page, pages: 1, items: games});
    });
};

exports.getUserMaps = function (req, res) {
    var page = (req.query.page) ? req.query.page : 1;
    var userID = req.query.userID;
    var companyID = req.user.companyID;
    var Maps = connection.model('Maps');
    Maps.find({companyID: companyID, owner: userID, nd_trash_deleted: false}, {mapName: 1, parentFolder: 1, isPublic: 1, mapDescription: 1, status: 1}, function (err, maps) {
        if (err) { console.error(err); }

        res.status(200).json({result: 1, page: page, pages: 1, items: maps});
    });
};


exports.getUserData = function (req, res) {
    var Companies = connection.model('Companies');
    Companies.findOne({companyID: req.user.companyID, nd_trash_deleted: false}, {}, function (err, company) {
        if (err) { console.error(err); }

        var theUserData = {};
        theUserData.companyData = req.user.companyData;
        theUserData.companyID = req.user.companyID;
        theUserData.contextHelp = req.user.contextHelp;
        theUserData.dialogs = req.user.dialogs;
        theUserData.filters = req.user.filters;
        theUserData.privateSpace = req.user.privateSpace;
        theUserData.roles = req.user.roles;
        theUserData.rolesData = req.user.rolesData;
        theUserData.status = req.user.status;
        theUserData.userName = req.user.userName;

        var createGames = false;
        var createMaps = false;
        var isWSTADMIN = false;
        var exploreData = false;
        var viewSQL = false;
        var publishGames = false;
        var publishMaps = false;
        var canPublish = false;

        if (req.isAuthenticated()) {
            for (var i in req.user.roles) {
                if (req.user.roles[i] === 'WSTADMIN') {
                    isWSTADMIN = true;
                    createGames = true;
                    createMaps = true;
                    createPages = true;
                    exploreData = true;
                    viewSQL = true;
                    canPublish = true;
                    publishGames = true;
                    publishMaps = true;

                    req.session.gamesCreate = createGames;
                    req.session.mapsCreate = createMaps;
                    req.session.exploreData = exploreData;
                    req.session.viewSQL = viewSQL;
                    req.session.isWSTADMIN = isWSTADMIN;
                    req.session.canPublish = canPublish;
                    req.session.publishGames = publishGames;
                    req.session.publishMaps = publishMaps;

                    theUserData.gamesCreate = createGames;
                    theUserData.mapsCreate = createMaps;
                    theUserData.exploreData = exploreData;
                    theUserData.viewSQL = viewSQL;
                    theUserData.isWSTADMIN = isWSTADMIN;
                    theUserData.canPublish = canPublish;
                    theUserData.publishGames = publishGames;
                    theUserData.publishMaps = publishMaps;
                }
            }
        }

        if (req.user.roles.length > 0 && !isWSTADMIN) {
            var Roles = connection.model('Roles');
            Roles.find({ _id: { $in: req.user.roles } }, {}, function (err, roles) {
                if (err) { console.error(err); }

                req.session.rolesData = roles;

                for (var i in roles) {
                    if (roles[i].gamesCreate) { createGames = true; }
                    if (roles[i].mapsCreate) { createMaps = true; }
                    if (roles[i].pagesCreate) { createPages = true; }
                    if (roles[i].exploreData) { exploreData = true; }
                    if (roles[i].viewSQL) { viewSQL = true; }
                    if (roles[i].gamesPublish) { publishGames = true; }
                    if (roles[i].mapsPublish) { publishMaps = true; }
                }

                req.session.gamesCreate = createGames;
                req.session.mapsCreate = createMaps;
                req.session.pagesCreate = createPages;
                req.session.exploreData = exploreData;
                req.session.viewSQL = viewSQL;
                req.session.isWSTADMIN = isWSTADMIN;
                req.session.canPublish = canPublish;
                req.session.publishGames = publishGames;
                req.session.publishMaps = publishMaps;

                theUserData.gamesCreate = createGames;
                theUserData.mapsCreate = createMaps;
                theUserData.exploreData = exploreData;
                theUserData.viewSQL = viewSQL;
                theUserData.isWSTADMIN = isWSTADMIN;
                theUserData.canPublish = canPublish;
                theUserData.publishGames = publishGames;
                theUserData.publishMaps = publishMaps;

                res.status(200).json({result: 1, page: 1, pages: 1, items: {user: theUserData, companyData: company, rolesData: roles, gamesCreate: createGames, mapsCreate: createMaps, exploreData: exploreData}});
            });
        } else {
            // var user = (req.user) ? req.user : false;
            res.status(200).json({result: 1, page: 1, pages: 1, items: {user: theUserData, companyData: company, rolesData: [], gamesCreate: createGames, mapsCreate: createMaps, exploreData: exploreData, isWSTADMIN: isWSTADMIN}});
        }
    });
};
exports.getUserOtherData = function (req, res) {
    var Users = connection.model('Users');
    Users.findOne({_id: req.user._id}, {}, function (err, user) {
        if (err) { console.error(err); }

        res.status(200).json({result: 1, page: 1, pages: 1, items: user});
    });
};

exports.getUserObjects = async function (req, res) {
    const Companies = connection.model('Companies');
    const query = {
        'companyID': req.user.companyID,
        'nd_trash_deleted': false
    };
    const company = await Companies.findOne(query).exec();

    const folders = company.sharedSpace;

    let canPublish = false;
    if (req.session.isWSTADMIN) {
        canPublish = true;
        await getFolderStructureForWSTADMIN(folders, 0);
    } else {
        if (req.user.roles.length > 0) {
            const Roles = connection.model('Roles');
            const query = {
                '_id': { '$in': req.user.roles },
                'companyID': req.user.companyID
            };
            const roles = await Roles.find(query).lean().exec();

            canPublish = await navigateRoles(folders, roles);
        }
    }

    const games = await getNoFolderGames();
    games.forEach(game => folders.push(game));

    const maps = await getNoFolderMaps();
    maps.forEach(map => folders.push(map));

    const body = {
        result: 1,
        page: 1,
        pages: 1,
        items: folders,
        userCanPublish: canPublish
    };
    res.status(200).json(body);
};

async function navigateRoles (folders, rolesData) {
    var canPublish = false;

    for (const r in rolesData) {
        if (!rolesData[r].grants || rolesData[r].grants.length === 0) {
            rolesData.splice(r, 1);
        }
    }

    for (const r in rolesData) {
        for (const g in rolesData[r].grants) {
            var theGrant = rolesData[r].grants[g];

            const publish = await setGrantsToFolder_v2(folders, theGrant);
            if (publish) {
                canPublish = true;
            }
        }
    }

    return canPublish;
}

async function setGrantsToFolder_v2 (folders, grant) {
    var publish = false;

    for (var i in folders) {
        const folder = folders[i];
        if (folder.id === grant.folderID) {
            folder.grants = grant;

            if (grant.publishGames === true) {
                publish = true;
            }

            const games = await getGamesForFolder(grant.folderID, grant);
            games.forEach(game => folder.nodes.push(game));

            const maps = await getMapsForFolder(grant.folderID, grant);
            maps.forEach(map => folder.nodes.push(map));

            return publish;
        } else {
            if (folder.nodes && folder.nodes.length > 0) {
                return setGrantsToFolder_v2(folder.nodes, grant);
            }
        }
    }
}

async function getFolderStructureForWSTADMIN (folders, index) {
  console.log(folders);
    const folder = folders[index];

    if (folder) {
        if (!folder.nodes) {
            folder.nodes = [];
        }

        await getFolderStructureForWSTADMIN(folder.nodes, 0);

        folder.grants = {
            folderID: folder.id,
            executeMaps: true,
            executeGames: true,
            publishGames: true
        };

        const games = await getGamesForFolder(folder.id, folder.grants);
        games.forEach(game => folder.nodes.push(game));

        const maps = await getMapsForFolder(folder.id, folder.grants);
        maps.forEach(map => folder.nodes.push(map));

        await getFolderStructureForWSTADMIN(folders, index + 1);
    }
}

async function getGamesForFolder (idfolder, grant) {
    var nodes = [];

    if (!grant || grant.executeGames) {
        const Games = connection.model('Games');

        const query = {
            'nd_trash_deleted': false,
            'companyID': 'COMPID',
            'parentFolder': idfolder,
            'isPublic': true
        };
        const projection = {gameName: 1, gameDescription: 1};

        const games = await Games.find(query).select(projection).exec();
        nodes = games.map(game => ({
            id: game._id,
            title: game.gameName,
            description: game.gameDescription,
            nodes: []
        }));
    }

    return nodes;
}

async function getMapsForFolder (idfolder, grant) {
    var nodes = [];

    if (!grant || grant.executeMaps) {
        const Maps = connection.model('Maps');

        const query = {
            'nd_trash_deleted': false,
            'companyID': 'COMPID',
            'parentFolder': idfolder,
            'isPublic': true
        };
        const projection = { mapName: 1, mapDescription: 1 };

        const maps = await Maps.find(query).select(projection).exec();
        nodes = maps.map(maps => ({
            id: map._id,
            title: map.mapName,
            description: map.mapDescription,
            nodes: []
        }));
    }

    return nodes;
}

async function getNoFolderGames () {
    return getGamesForFolder('root');
}

async function getNoFolderMaps () {
    return getMapsForFolder('root');
}

exports.getUserLastExecutions = function (req, res) {
    var statistics = connection.model('statistics');

    let find;
    if (req.session.isWSTADMIN) {
        find = {action: 'execute'};
    } else {
        find = {'$and': [{userID: '' + req.user._id + ''}, {action: 'execute'}]};
    }

    // Last executions

    statistics.aggregate([
        { $match: find },
        { $group: {
            _id: {relationedID: '$relationedID',
                type: '$type',
                relationedName: '$relationedName',
                action: '$action'},
            lastDate: { $max: '$createdOn' }
        }},
        { $sort: { lastDate: -1 } }
    ], function (err, lastExecutions) {
        if (err) {
            console.log(err);
            return;
        }

        statistics.aggregate([
            { $match: find },
            { $group: {
                _id: {relationedID: '$relationedID',
                    type: '$type',
                    relationedName: '$relationedName',
                    action: '$action'},
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ], function (err, mostExecuted) {
            if (err) {
                console.log(err);
                return;
            }
            var mergeResults = { theLastExecutions: lastExecutions, theMostExecuted: mostExecuted };
            res.status(200).json({result: 1, page: 1, pages: 1, items: mergeResults});
        });
    });
};
