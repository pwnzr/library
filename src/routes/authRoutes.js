var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                var user = {
                    username: req.body.userName,
                    password: req.body.password
                };
                // results is a bunch of mongodb-related stuff
                // this is wrap-up of a data we've inserted
                collection.insert(user, function (err, results) {
                    req.login(results.ops[0], function () {         // results.ops[0] = user
                        res.redirect('/auth/profile');
                    });
                });
            });
        });
    authRouter.route('/signIn')
        // tell Passport to use local strategy
        .post(passport.authenticate('local', {
            failureRedirect: '/'
        }), function (req, res) {
            res.redirect('/auth/profile');
        });
    authRouter.route('/profile')
        .all(function (req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }
            next();
        })
        .get(function (req, res) {
            res.json(req.user);
        });
    return authRouter;
};

module.exports = router;
