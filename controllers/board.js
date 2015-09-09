module.exports = function(app) {
    var BoardDB = app.models.board;
    var StoryDB = app.models.story;
    var TaskDB = app.models.task;
    var SequenceDB = app.models.sequence;
    var UsuarioDB = app.models.usuario;

    var BoardController = {
        list: function(req, res, next) {
            var userEmail = req.session.usuario.email;

            BoardDB.find({
                $or: [{
                    "listShare.email": userEmail
                }, {
                    "userName": userEmail
                }]
            }, function(erro, boards) {
                if (!erro) {
                    var resultado = {
                        boards: boards
                    };
                    res.render('board/board_list', resultado);
                }
                else {
                    next(erro);
                }
            });

        },
        new: function(req, res) {
            res.render('board/board_new');
        },
        save: function(req, res, next) {
            var usuario = req.session.usuario;
            req.body.board.userName = usuario.email;
            req.body.board.userId = usuario._id;
            req.body.board.listShare = [];
            BoardDB.create(req.body.board, function(erro, board) {
                if (!erro) {
                    res.redirect('/board/list');
                }
                else {
                    next(erro);
                }
            });
        },
        show: function(req, res, next) {
            var boardId = req.params.id;
            BoardDB.findById(boardId, function(erro, board) {
                if (!erro) {
                    StoryDB.find({
                            boardId: boardId
                        },
                        function(erro, stories) {
                            if (!erro) {
                                TaskDB.find({
                                        boardId: boardId
                                    },
                                    function(erro, tasks) {
                                        var resultado = {
                                            board: board,
                                            userId: req.session.usuario._id,
                                            stories: stories,
                                            tasks: tasks
                                        };
                                        res.render('board/board', resultado);
                                    });
                            }
                            else {
                                next(erro);
                            }
                        });
                }
                else {
                    next(erro);
                }
            });
        },
        destroy: function(req, res, next) {
            var boardId = req.params.id;
            BoardDB.remove({
                _id: boardId
            }, function(erro) {
                if (!erro) {
                    StoryDB.remove({
                        boardId: boardId
                    }, function(erro) {
                        if (!erro) {
                            TaskDB.remove({
                                boardId: boardId
                            }, function(erro) {
                                if (!erro) {
                                    res.redirect('/board/list');
                                }
                                else {
                                    next(erro);
                                }
                            });
                        }
                        else {
                            next(erro);
                        }
                    });
                }
                else {
                    next(erro);
                }
            });
        },
        share: function(req, res, next) {
            var boardId = req.params.id;
            UsuarioDB.findOne({
                    email: req.body.user.email
                },
                function(erro, user) {
                    if (!erro) {
                        if (!user) {
                            next(new Error('Email invalid.'));
                        }
                        else {

                            BoardDB.findById(boardId, function(erro, board) {
                                if (!erro) {
                                    if (board.userId == user._id) {
                                        next(new Error('User is the owner.'));
                                    }
                                    else {
                                        var userShared = undefined;
                                        if (board.listShare) {
                                            for (var i = 0; i < board.listShare.length; i++) {
                                                var us = board.listShare[i];
                                                if (us.email == req.body.user.email) {
                                                    userShared = us;
                                                    break;
                                                }
                                            }
                                        }

                                        if (userShared) {
                                            next(new Error(422, 'User already registered.'));
                                        }
                                        else {
                                            var u = {
                                                userId: user._id,
                                                email: user.email
                                            };
                                            console.log(u);

                                            BoardDB.update({
                                                _id: boardId
                                            }, {
                                                $push: {
                                                    listShare: u
                                                }
                                            }, function(erro) {
                                                if (!erro) {
                                                    res.redirect('/board/' + boardId);
                                                }
                                                else {
                                                    next(erro);
                                                }
                                            });
                                        }
                                    }
                                }
                                else {
                                    next(erro);
                                }
                            });
                        }
                    }
                    else {
                        next(erro);
                    }
                });
        },
        unshare: function(req, res, next) {
            var boardId = req.params.id;
            BoardDB.update({
                _id: boardId
            }, {
                $pull: {
                    listShare: {
                        _id: req.body.user._id
                    }
                }
            },function(erro) {
                if (!erro) {
                    res.redirect('/board/' + boardId);
                }
                else {
                    next(erro);
                }
            });


        },
        saveStory: function(req, res, next) {
            var boardId = req.params.id;
            var handler = function(erro, story) {
                if (!erro) {
                    res.redirect('/board/' + boardId);
                }
                else {
                    next(erro);
                }
            };
            if (!req.body.story._id) {
                req.body.story.boardId = boardId;
                StoryDB.create(req.body.story, handler);
            }
            else {
                StoryDB.update({
                    _id: req.body.story._id
                }, {
                    $set: {
                        "name": req.body.story.name
                    }
                }, handler);
            }
        },
        destroyStory: function(req, res, next) {
            var boardId = req.params.id;
            StoryDB.remove({
                _id: req.body.story._id
            }, function(erro) {
                if (!erro) {
                    res.redirect('/board/' + boardId);
                }
                else {
                    next(erro);
                }
            });
        },
        saveTask: function(req, res, next) {
            var boardId = req.params.id;
            var handler = function(erro, story) {
                if (!erro) {
                    res.redirect('/board/' + boardId);
                }
                else {
                    next(erro);
                }
            };
            if (!req.body.task._id) {
                req.body.task.state = "TODO";
                req.body.task.boardId = boardId;
                SequenceDB.next("taskRank", function(erro, rank) {
                    req.body.task.rank = rank;
                    TaskDB.create(req.body.task, handler);
                })

            }
            else {
                TaskDB.update({
                    _id: req.body.task._id
                }, {
                    $set: {
                        "name": req.body.task.name,
                        "assigned": req.body.task.assigned
                    }
                }, handler);
            }
        },
        destroyTask: function(req, res, next) {
            var boardId = req.params.id;
            TaskDB.remove({
                _id: req.body.task._id
            }, function(erro) {
                if (!erro) {
                    res.redirect('/board/' + boardId);
                }
                else {
                    next(erro);
                }
            });
        }
    };
    return BoardController;
};