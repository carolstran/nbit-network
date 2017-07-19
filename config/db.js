const spicedPg = require('spiced-pg');
var dbUrl = process.env.DATABASE_URL || require('./passwords.json').dbUrl;
const db = spicedPg(dbUrl);
const auth = require('./auth');

// FUNCTIONS
function registerUser(first, last, email, hash) {
    let q = `INSERT INTO users (first_name, last_name, email, password_hash)
             VALUES ($1, $2, $3, $4) RETURNING id;`;

    let params = [
        first,
        last,
        email,
        hash
    ];

    return db.query(q, params)
    .then(function(results) {
        return results.rows[0];
    }).catch(function(err) {
        console.log('Error registerUser in DB', err);
        throw err;
    });
}

function checkAccount(email, password) {
    let q = `SELECT * FROM users WHERE email = $1;`;
    let params = [
        email
    ];
    return db.query(q, params)
    .then(function(result) {
        if (result.rows && result.rows[0]) {
            var hashedPassword = result.rows[0].password_hash;
            return auth.checkPassword(password, hashedPassword)
            .then(function(passwordMatch) {
                if (!passwordMatch) {
                    throw new Error('Boogus credentials');
                }

                result.rows.forEach(row => {
                    row.profile_pic_url = 'https://s3.amazonaws.com/nbit-network/' + row.profile_pic_url;
                });

                let newObj = {
                    passwordMatch: passwordMatch,
                    userEmail: result.rows[0].email,
                    userFirstName: result.rows[0].first_name,
                    userLastName: result.rows[0].last_name,
                    userHash: result.rows[0].password_hash,
                    userId: result.rows[0].id,
                    userProfilePicUrl: result.rows[0].profile_pic_url,
                    userBio: result.rows[0].bio
                };
                return newObj;
            }).catch(function(err) {
                throw err;
            });
        } else {
            throw new Error('Account not found');
        }
    }).catch(function(err) {
        console.log('Error checkAccount in DB', err);
        throw err;
    });
}

function uploadProfilePic(file, id) {
    let q = `UPDATE users SET profile_pic_url = $1 WHERE id = $2;`;
    let params = [
        file,
        id
    ];

    return db.query(q, params)
    .then(function(result) {
        result.rows.forEach(row => {
            row.profile_pic_url = 'https://s3.amazonaws.com/nbit-network/' + row.profile_pic_url;
        });
        return result;
    }).catch(function(err) {
        console.log('Error updateProfilePic in DB', err);
        throw err;
    });
}

function updateBio(bio, id) {
    let q = `UPDATE users SET bio = $1 WHERE id = $2;`;
    let params = [
        bio,
        id
    ];

    return db.query(q, params)
    .then(function(result) {
        return result;
    }).catch(function(err) {
        console.log('Error updateBio in DB', err);
        throw err;
    });
}

function getOtherUserProfile(id) {
    let q = `SELECT * FROM users WHERE id = $1;`;
    let params = [
        id
    ];

    return db.query(q, params)
    .then(function(result) {
        result.rows.forEach(row => {
            row.profile_pic_url = 'https://s3.amazonaws.com/nbit-network/' + row.profile_pic_url;
        });
        return result.rows[0];
    }).catch(function(err) {
        console.log('Error getOtherUserProfile in DB', err);
        throw err;
    });
}

// FRIEND REQUESTS AND STATUS
function getFriendStatus(userOne, userTwo) {
    let q = `SELECT status, recipient_id, sender_id FROM friend_requests
             WHERE (recipient_id = $1 OR sender_id = $1)
             AND (recipient_id = $2 OR sender_id = $2)
             AND (status = 'PENDING' OR status = 'ACCEPTED');`;
    let params = [
        userOne,
        userTwo
    ];

    return db.query(q, params).then(function(result) {
        return result.rows[0];
    }).catch(function(err) {
        console.log('Error getFriendStatus in DB', err);
        throw err;
    });
}

function sendFriendRequest(recipientId, senderId) {
    let q = `INSERT INTO friend_requests(recipient_id, sender_id, status)
             VALUES ($1, $2, $3) RETURNING status, recipient_id, sender_id;`;
    let params = [
        recipientId,
        senderId,
        'PENDING'
    ];

    return db.query(q, params).then(function(result) {
        return result.rows[0];
    }).catch(function(err) {
        console.log('Error sendFriendRequest in DB', err);
        throw err;
    });
}

function cancelFriendRequest(recipientId, senderId) {
    let q = `UPDATE friend_requests SET status = $3
             WHERE (recipient_id = $1 AND sender_id = $2 AND status = 'PENDING')
             RETURNING status;`;
    let params = [
        recipientId,
        senderId,
        'CANCELLED'
    ];

    return db.query(q, params).then(function(result) {
        return result.rows.length;
    }).catch(function(err) {
        console.log('Error cancelFriendRequest in DB', err);
        throw err;
    });
}

function acceptFriendRequest(userOne, userTwo) {
    let q = `UPDATE friend_requests SET status = $3
             WHERE (recipient_id = $1 OR sender_id = $1)
             AND (recipient_id = $2 OR sender_id = $2)
             AND (status = 'PENDING')
             RETURNING status;`;
    let params = [
        userOne,
        userTwo,
        'ACCEPTED'
    ];

    return db.query(q, params).then(function(result) {
        return result.rows[0];
    }).catch(function(err) {
        console.log('Error acceptFriendRequest in DB', err);
        throw err;
    });
}

function terminateFriendship(userOne, userTwo) {
    let q = `UPDATE friend_requests SET status = $3
             WHERE (recipient_id = $1 OR sender_id = $1)
             AND (recipient_id = $2 OR sender_id = $2)
             AND (status = 'ACCEPTED')
             RETURNING status;`;
    let params = [
        userOne,
        userTwo,
        'TERMINATED'
    ];

    return db.query(q, params).then(function(result) {
        return result.rows[0];
    }).catch(function(err) {
        console.log('Error terminateFriendship in DB', err);
        throw err;
    });
}


// FRIENDS PAGE
function getFriends(id) {
    let q = `SELECT users.id, recipient_id, sender_id, status, first_name, last_name, profile_pic_url
             FROM friend_requests JOIN users
             ON (users.id = recipient_id AND recipient_id <> $1)
             OR (users.id = sender_id AND sender_id <> $1)
             WHERE (recipient_id = $1 OR sender_id = $1)
             AND (status = 'ACCEPTED');`;
    let params = [
        id
    ];

    return db.query(q, params).then(function(results) {
        results.rows.forEach(row => {
            row.profile_pic_url = 'https://s3.amazonaws.com/nbit-network/' + row.profile_pic_url;
        });
        return results.rows;
    }).catch(function(err) {
        console.log('Error getFriends in DB', err);
        throw err;
    });
}

function getPendingRequests(id) {
    let q = `SELECT users.id, recipient_id, sender_id, status, first_name, last_name, profile_pic_url
             FROM friend_requests JOIN users ON sender_id = users.id
             WHERE (recipient_id = $1) AND (status = 'PENDING');`;
    let params = [
        id
    ];

    return db.query(q, params).then(function(results) {
        results.rows.forEach(row => {
            row.profile_pic_url = 'https://s3.amazonaws.com/nbit-network/' + row.profile_pic_url;
        });
        return results.rows;
    }).catch(function(err) {
        console.log('Error getPendingRequests in DB', err);
        throw err;
    });
}

function getUsersByIds(onlineUserIds) {
    let q = `SELECT id, first_name, last_name, profile_pic_url FROM users WHERE id IN (${onlineUserIds});`;

    return db.query(q).then(function(results) {
        results.rows.forEach(row => {
            row.profile_pic_url = 'https://s3.amazonaws.com/nbit-network/' + row.profile_pic_url;
        });
        return results.rows;
    });
}

// EXPORTS
module.exports.registerUser = registerUser;
module.exports.checkAccount = checkAccount;
module.exports.uploadProfilePic = uploadProfilePic;
module.exports.updateBio = updateBio;
module.exports.getOtherUserProfile = getOtherUserProfile;
module.exports.getFriendStatus = getFriendStatus;
module.exports.sendFriendRequest = sendFriendRequest;
module.exports.cancelFriendRequest = cancelFriendRequest;
module.exports.acceptFriendRequest = acceptFriendRequest;
module.exports.terminateFriendship = terminateFriendship;
module.exports.getFriends = getFriends;
module.exports.getPendingRequests = getPendingRequests;
module.exports.getUsersByIds = getUsersByIds;
