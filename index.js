var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(1337);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/chat.html');
});

app.use(express.static(__dirname + '/assets'));

var usernames = {};
var users = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('new message', function (data) {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', function (username) {
    socket.username = username;
    usernames[username] = username;
    ++users;
    addedUser = true;

    socket.emit('login', {
      users: users
    });

    socket.broadcast.emit('user joined', {
      username: socket.username,
      users: users
    });
  });

  socket.on('disconnect', function () {
    if (addedUser) {
      delete usernames[socket.username];
      --users;

      socket.broadcast.emit('user left', {
        username: socket.username,
        users: users        
      });
    }
  });

});
