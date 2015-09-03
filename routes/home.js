module.exports = function(app) {
    var home = app.controllers.home;
    app.get('/', function(req, res, next) {
        if (req.session.usuario) {
            return res.redirect('/board/list');
        }
        return next();
    }, home.index);
    app.post('/entrar', home.login);
    app.get('/sair', home.logout);
};