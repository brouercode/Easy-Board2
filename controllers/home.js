module.exports = function(app) {
   var Usuario = app.models.usuario;

    var HomeController = {
        index: function(req, res) {
            res.render('home/index');
        },
        login: function(req, res, next) {
            var query = {
                 email: req.body.usuario.email
            };

             Usuario.findOne(query)
                 .select('email password')
                 .exec(function(erro, usuario) {

                 if (usuario) {
                     if(usuario.password == req.body.usuario.password){
                         req.session.usuario = usuario;
                         res.redirect('/board/list');
                     }else{
                         next(new Error('Email / Password Invalid!'));
                     }
                 }
                 else {
                     Usuario.create(req.body.usuario, function(erro, usuario) {
                         if (erro) {
                             res.redirect('/');
                         }
                         else {
                         req.session.usuario = usuario;
                             res.redirect('/board/list');
                         }
                     });
                 }
             });
        },
        logout: function(req, res) {
            req.session.destroy();
            res.redirect('/');
        }
    };
    return HomeController;
};