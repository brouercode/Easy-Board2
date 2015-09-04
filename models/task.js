module.exports = function(app) {
    var Schema = require('mongoose').Schema;

    var story = Schema({
        name: {
            type: String,
            required: true
        },
        assigned: {
            type: String,
        },
        storyId: {
            type: String,
            required: true
        },
        boardId: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        rank: {
            type: Number,
            required: true
        }
    });
    return db.model('tasks', story);
};