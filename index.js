const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const db = require('./config/db');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

let onlineUsers = [];
let chatMessages = [];

// STATIC DIRECTORIES
app.use('/public', express.static(`${__dirname}/public`));
app.use('/uploads', express.static(`${__dirname}/uploads`));

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
    secret: 'lK8s2gneWH',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

// REQUIRE BUILD.JS
if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}

// ROUTERS
app.use(require('./routes/appRoutes'));
app.use(require('./routes/authRoutes'));
app.use(require('./routes/friendRoutes'));

// SOCKET ROUTES
app.get('/connected/:socketId', function(req, res) {
    if (req.session.user) {
        for (let i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i]['socketId'] == req.params.socketId) return;
        }

        io.sockets.sockets[req.params.socketId] && onlineUsers.push({
            socketId: req.params.socketId,
            userId: req.session.user.id
        });
    } else {
        return;
    }
});

app.get('/onlineUsers', function(req, res) {
    let onlineUserIds = [];
    for (let i = 0; i < onlineUsers.length; i++) {
        if (onlineUserIds.indexOf(onlineUsers[i].userId) == -1 && onlineUsers[i].userId != req.session.user.id) {
            onlineUserIds.push(onlineUsers[i].userId);
        }
    }

    if (onlineUserIds.length > 0) {
        db.getUsersByIds(onlineUserIds).then(function(results) {
            res.json({ success: true, onlineUsers: results });
        }).catch(function(err) {
            console.log('Error getting onlineUsers', err);
            res.json({ success: false });
        });
    }
});

app.get('/chatMessages', function(req, res) {
    res.json({
        chatMessages: chatMessages.slice(Math.max(chatMessages.length - 10, 0))
    });
});

// CATCHALL ROUTE
app.get('*', function(req, res) {
    if (!req.session.user && req.url != '/welcome') {
        return res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

// SERVER
server.listen(8080, function() {
    console.log("LISTENING on port 8080");
});

// SOCKET

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    socket.on('disconnect', function() {
        for (let i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].socketId == socket.id) {
                onlineUsers.splice(i, 1);
            }
        }
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    socket.on('chat', (messageData) => {
        const user = onlineUsers.find((user) => user.socketId == socket.id)
        if (!user || user.userId != messageData.id) {
            return;
        }
        messageData.timestamp = new Date().toLocaleString();
        chatMessages.push(messageData);
        io.sockets.emit('updateChat', chatMessages.slice(Math.max(chatMessages.length - 10, 0)));
    });
});
