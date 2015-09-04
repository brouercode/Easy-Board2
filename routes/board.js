module.exports = function(app) {
    var autenticar = require('../autenticador');
    var board = app.controllers.board;
    app.get('/board/list', autenticar, board.list);
    app.get('/board/new', autenticar, board.new);
    app.post('/board/save', autenticar, board.save);
    app.get('/board/:id', autenticar, board.show);
    app.del('/board/:id', autenticar, board.destroy);
    app.post('/board/:id/story', autenticar, board.saveStory);
    app.del('/board/:id/story', autenticar, board.destroyStory);
    app.post('/board/:id/task', autenticar, board.saveTask);
    app.del('/board/:id/task', autenticar, board.destroyTask);
};