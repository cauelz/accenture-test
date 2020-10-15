const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, resp, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return resp.status(409).json({
                   message: 'E-mail já existente'
                });
            } else {
                bcrypt.hash(req.body.senha, 10, (err, hash) => {
                    if (err) {
                        return resp.status(500).json({
                            error:err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            nome: req.body.nome,
                            email: req.body.email,
                            senha: hash,
                            telefone: req.body.telefone,

                        });
                        user
                            .save()
                            .then( result => {
                                console.log(result);
                                resp.status(201).json({
                                    message: "User criado"
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                resp.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        })
})

router.post('/login', (req, resp, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return resp.status(401).json({
                    message: 'Usuário e/ou senha inválidos'
                });
            }
            bcrypt.compare(req.body.senha, user[0].senha, (err, result) => {
                if (err) {
                    return resp.status(401).json({
                        message: 'Usuário e/ou senha inválidos'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    "1234", 
                    {
                        expiresIn: 1800,
                    }
                    );
                    return resp.status(200).json({
                       message: 'Logado com sucesso',
                       token: token 
                    })
                }
                resp.status(401).json({
                    message: 'Usuário e/ou senha inválidos'
                });
            });
        })
        .catch();
})

router.delete('/:userId', (req, resp, next) => {
    User.remove({_id:req.params.id})
        .exec()
        .then(result => {
            resp.status(200).json({
                message: 'User deletado'
            })
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
})
module.exports = router;