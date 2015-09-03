module.exports = function(app) {
    var BoardController = {
        list: function(req, res) {
            res.render('board/board_list');
        }
    };
    return BoardController;
};