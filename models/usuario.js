module.exports = function(app) {
    var Schema = require('mongoose').Schema;

    var usuario = Schema({
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        }
    });
    return db.model('usuarios', usuario);
};