module.exports = function(app) {
    var Schema = require('mongoose').Schema;

    var userShare = Schema({
        nome: String,
        email: String
    });
    
    var board = Schema({
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        listShare: [userShare]
    });
    return db.model('boards', board);
};