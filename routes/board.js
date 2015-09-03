module.exports = function(app) {
    var autenticar = require('../autenticador');
    var board = app.controllers.board;
    app.get('/board/list', autenticar, board.list);
    
};