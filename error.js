exports.notFound = function(req, res, next) {
    res.status(404);
    res.render('not-found');
};

exports.serverError = function(error, req, res, next) {
    res.status(500);
    res.send("<script>alert(\"" + error.message + "\");window.history.back();</script>");
};