exports.public = function (req, res) {
    var name = req.params.name;
    res.render('view/' + name);
};

exports.controllerPublic = function (req, res) {
    var controller = req.params.controller;
    var name = req.params.name;
    res.render('view/' + controller + '/' + name);
};

exports.controllerCustomPartial = function (req, res) {
    var controller = req.params.controller;
    var name = req.params.name;
    res.render('view/custom/' + controller + '/' + name);
};
