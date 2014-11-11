var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(1337);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/chat.html');
});

app.use(express.static(__dirname + '/assets'));

io.on('connection', function (socket) {
  socket.emit('message', { message: "Welcome to this awesome chat" });
  socket.on('send', function (data) {
    io.emit('message', data)
  });
});
