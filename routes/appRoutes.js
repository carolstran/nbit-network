const express = require('express');
const router = express.Router();

const db = require('../config/db');
const toS3 = require('../config/toS3');
const multer = require('multer');

// MULTER MIDDLEWARE
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, `${__dirname}/../uploads`);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});


router.route('/userProfile')

    .get(function(req, res) {
        res.json({
            id: req.session.user.id,
            firstName: req.session.user.firstName,
            lastName: req.session.user.lastName,
            profilePicUrl: req.session.user.profilePicUrl,
            bio: req.session.user.bio
        });
    });

router.route('/uploadFile')

    .post(uploader.single('file'), function(req, res) {
        let file = `/uploads/${req.file.filename}`;
        req.session.user.profilePicUrl = file;

        if (req.file) {
            toS3(req.file).then(function() {
                db.uploadProfilePic(file, req.session.user.id).then(function() {
                    res.json({
                        success: true,
                        id: req.session.user.id,
                        profilePicUrl: req.session.user.profilePicUrl
                    });
                }).catch(function(err) {
                    console.log('Error uploading profile pic', err);
                    res.json({
                        sucess: false
                    });
                });
            }).catch(function(err) {
                console.log('Error uploading file to S3', err);
                res.json({
                    success: false
                });
            });
        } else {
            res.json({
                success: false
            });
        }
    });

router.route('/updateBio')

    .post(function(req, res) {
        db.updateBio(req.body.bio, req.session.user.id).then(function() {
            req.session.user.bio = req.body.bio;
            res.json({
                success: true,
                id: req.session.user.id,
                bio: req.session.user.bio
            });
        }).catch(function(err) {
            console.log('Error updating bio', err);
            res.json({
                success: false
            });
        });
    });

router.route('/user/:id')

    .get(function(req, res) {
        db.getOtherUserProfile(req.params.id).then(function(result) {
            res.json({
                success: true,
                firstName: result.first_name,
                lastName: result.last_name,
                profilePicUrl: result.profile_pic_url,
                bio: result.bio
            });
        }).catch(function(err) {
            console.log('Error showing other user profile', err);
            res.json({
                success: false
            });
        });
    });

module.exports = router;
