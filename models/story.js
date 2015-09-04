module.exports = function(app) {
    var Schema = require('mongoose').Schema;

    var story = Schema({
        name: {
            type: String,
            required: true
        },
        boardId: {
            type: String,
            required: true
        }
    });
    return db.model('stories', story);
};