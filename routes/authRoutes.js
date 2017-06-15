const express = require('express');
const router = express.Router();

const db = require('../config/db');
const auth = require('../config/auth');

router.route('/register')

    .post(function(req, res) {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let password = req.body.password;

        auth.hashPassword(password).then(function(hash) {
            db.registerUser(firstName, lastName, email, hash)
            .then(function(result) {
                req.session.user = {
                    id: result.id,
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                };
                res.json({
                    success: true
                });
            }).catch(function(err) {
                console.log('Error registering user', err);
            });
        }).catch(function(err) {
            console.log('Error hashing password', err);
        });
    });

router.route('/login')

    .post(function(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        db.checkAccount(email, password).then(function(userObj) {
            if (userObj.passwordMatch == true) {
                req.session.user = {
                    id: userObj.userId,
                    firstName: userObj.userFirstName,
                    lastName: userObj.userLastName,
                    email: userObj.userEmail,
                    profilePicUrl: userObj.userProfilePicUrl,
                    bio: userObj.userBio
                };
                res.json({
                    success: true
                });
            } else if (userObj.passwordMatch == false) {
                res.json({
                    success: false
                });
            }
        }).catch(function(err) {
            console.log('Unable to login user', err);
            res.json({
                success: false
            });
        });
    });

router.route('/logout')

    .get(function(req, res) {
        req.session = null;
        res.json({ success: true });
    });

module.exports = router;
