const express = require('express');
const router = express.Router();

const db = require('../config/db');

router.route('/getFriendStatus')
    .get(function(req, res) {
        db.getFriendStatus(req.query.otherUserId, req.session.user.id)
        .then(function(result) {
            if (!result) {
                res.json({ success: true, action: 'Send Friend Request', actionUrl: '/sendFriendRequest' });
            } else if (result) {
                if (result.status == 'PENDING') {
                    if (result.sender_id == req.session.user.id) {
                        res.json({ success: true, action: 'Cancel Friend Request', actionUrl: '/cancelFriendRequest' });
                    } else {
                        res.json({ success: true, action: 'Accept Friend Request', actionUrl: '/acceptFriendRequest' });
                    }
                } else if (result.status == 'ACCEPTED') {
                    res.json({ success: true, action: 'Unfriend', actionUrl: '/terminateFriendship' });
                } else {
                    res.json({ success: true, action: 'Send Friend Request', actionUrl: '/sendFriendRequest' });
                }
            }
        }).catch(function(err) {
            console.log('Error showing friend status', err);
            res.json({ success: false });
        });
    });

router.route('/sendFriendRequest')

    .post(function(req, res) {
        db.sendFriendRequest(req.body.otherUserId, req.session.user.id)
        .then(function(result) {
            if (result.sender_id == req.session.user.id) {
                res.json({ success: true, action: 'Cancel Friend Request', actionUrl: '/cancelFriendRequest' });
            } else {
                res.json({ success: true, action: 'Accept Friend Request', actionUrl: '/acceptFriendRequest' });
            }
        }).catch(function(err) {
            console.log('Error sending friend request', err);
            res.json({ success: false });
        });
    });

router.route('/cancelFriendRequest')

    .post(function(req, res) {
        db.cancelFriendRequest(req.body.otherUserId, req.session.user.id)
        .then(function(result) {
            if (result > 0) {
                res.json({ success: true, action: 'Send Friend Request', actionUrl: '/sendFriendRequest' });
            } else {
                throw new Error('Unable to cancel friend request');
            }
        }).catch(function(err) {
            console.log('Error cancelling friend request', err);
            res.json({ success: false });
        });
    });

router.route('/acceptFriendRequest')

    .post(function(req, res) {
        db.acceptFriendRequest(req.body.otherUserId, req.session.user.id)
        .then(function(result) {
            if (result.status == 'ACCEPTED') {
                res.json({ success: true, action: 'Unfriend', actionUrl: '/terminateFriendship' });
            } else {
                throw new Error('Unable to accept friend request');
            }
        }).catch(function(err) {
            console.log('Error accepting friend request', err);
            res.json({ success: false });
        });
    });

router.route('/terminateFriendship')

    .post(function(req, res) {
        db.terminateFriendship(req.body.otherUserId, req.session.user.id)
        .then(function(result) {
            if (result.status = 'TERMINATED') {
                res.json({ success: true, action: 'Send Friend Request', actionUrl: '/sendFriendRequest' });
            } else {
                throw new Error('Unable to terminate friendship');
            }
        }).catch(function(err) {
            console.log('Error terminating friendship', err);
            res.json({ success: false })
        });
    });

router.route('/friendLists')

    .get(function(req, res) {
        Promise.all([
            db.getFriends(req.session.user.id),
            db.getPendingRequests(req.session.user.id)
        ]).then(function([friends, requests]) {
            res.json({
                friends,
                requests
            });
        });
    });

module.exports = router;
