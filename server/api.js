exports.public = function (req, res) {
    var name = req.params.name;
    res.render('public/view/' + name);
};

exports.controllerPublic = function (req, res) {
    var controller = req.params.controller;
    var name = req.params.name;
    res.render('public/' + controller + '/' + name);
};

exports.controllerCustomPartial = function (req, res) {
    var controller = req.params.controller;
    var name = req.params.name;
    res.render('partials/custom/' + controller + '/' + name);
};
