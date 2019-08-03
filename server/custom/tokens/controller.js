var Token = connection.model('Token');

const Controller = require('../../core/controller.js');

class TokensController extends Controller {
    constructor () {
        super(Token);
    }
}

var controller = new TokensController();

exports.TokensFindAll = async function (req, res) {
    req.query.trash = true;
    var result = controller.findAllParams(req);
    result = await controller.findAll(req);
    res.status(200).json(result);
};

exports.GetToken = function (req, res) {
    req.query.trash = true;

    controller.findOne(req).then(function (result) {
        if (!result.item || (!result.item.isPublic && !req.isAuthenticated())) {
            return res.status(403).send('Forbidden');
        }

        res.status(200).json(result);
        if (result.item) {
            // Note the execution in statistics
            var statistics = connection.model('statistics');
            var stat = {};
            stat.type = 'token';

            if (req.query.linked === true) {
                stat.action = 'execute link';
            } else {
                stat.action = 'execute';
            }
            statistics.save(req, stat);
        }
    });
};

exports.TokensFindOne = function (req, res) {
    req.query.trash = true;

    controller.findOne(req).then(function (result) {
        res.status(200).json(result);
    });
};

exports.TokensCreate = function (req, res) {
    if (!req.session.tokensCreate && !req.session.isWSTADMIN) {
        res.status(401).json({ result: 0, msg: 'You do not have permissions to create tokens' });
    } else {
        req.query.trash = true;


        controller.create(req).then(function (result) {
            res.status(200).json(result);
        });
    }
};

exports.TokensUpdate = function (req, res) {
    req.query.trash = true;
    req.query.companyid = true;
    req.query.properties = true;
    var data = req.body;

    if (!req.session.isWSTADMIN) {
        var Tokens = connection.model('Token');
        Tokens.findOne({ _id: data._id }, { _id: 1 }, {}, function (err, item) {
            if (err) throw err;
            if (item) {
                controller.update(req).then(function (result) {
                    res.status(200).json(result);
                });
            } else {
                res.status(401).json({ result: 0, msg: 'You don´t have permissions to update this token, or this token do not exists' });
            }
        });
    } else {
        controller.update(req).then(function (result) {
            res.status(200).json(result);
        });
    }
};

exports.TokensDelete = async function (req, res) {
    const token = await getTokenFromRequest(req);
    if (token) {
        token.remove().then(() => {
            res.status(200).json({ result: 1, msg: 'Token deleted' });
        }, err => {
            console.error(err);
            res.status(500).json({ result: 0, msg: 'Error deleting token' });
        });
    } else {
        res.status(404).json({ result: 0, msg: 'This token does not exist' });
    }
};

exports.TokensGetData = async function (req, res) {
  var data = req.body;
  console.log(req);
  var query = data.query;
  const Tokens = connection.model('Token');
  Tokens.findOne({ _id: data._id }, { _id: 1 }, function (err, token) {

    var tokenData = {};

    tokenData.health = req.token.health;
    tokenData.mana = req.token.mana;
    tokenData.stamina = req.token.stamina;

      res.status(200).json({health: tokenData.health, mana: tokenData.mana, stamina: tokenData.stamina });

    })

};

function getTokenFromRequest (req) {
    const conditions = {
        _id: req.body._id || req.body.id,
        companyID: req.user.companyID,
    };

    if (!req.session.isWSTADMIN) {
        conditions.owner = req.user._id;
    }

    return Tokens.findOne(conditions);
}
