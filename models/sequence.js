module.exports = function(app) {
    var Schema = require('mongoose').Schema;

    var sequence = Schema({
        name: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        seq: {
            type: Number,
            required: true
        }
    });
    var instance = db.model('sequences', sequence);

    instance.next = function(name, handler) {
        this.findOne({
            query: {
                name: name
            }
        }, function(erro, sequence) {
            var seq = undefined;
            if (!erro) {
                if (sequence) {
                    sequence.seq += 1;

                    instance.update({
                        _id: sequence._id
                    }, {
                        $inc: {
                            seq: 1
                        }
                    });
                    
                }
                else {
                    sequence = {
                        name: name,
                        seq: 1
                    };
                    instance.create(sequence);
                }
                seq = sequence.seq;
            }

            handler(erro, seq);
        });



    };




    return instance;
};