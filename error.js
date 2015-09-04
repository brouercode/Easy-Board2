exports.notFound = function(req, res, next) {
    res.status(404);
    res.render('not-found');
};

exports.serverError = function(error, req, res, next) {
    res.status(500);
    var msg = error.message.replace(/"/g, '\'');
    res.send("<script>alert(\"" + msg + "\");window.history.back();</script>");
};