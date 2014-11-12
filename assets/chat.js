$(function() {

  var messages = [];
  var socket = io.connect('http://192.168.1.105/');
  var field = document.getElementById("field");
  var send = document.getElementById("send");
  var content = document.getElementById("chat")
  var userInput = document.getElementById("username")
  var username;  


  function setUsername () {
    username = userInput.value;
    if (username) {
      socket.emit('add user', username);
      $('.board').show();
      $('#username').hide();
    }
  }

  function sendMessage () {
    var message = field.value;

    if (message) {
      field.value = "";
      addMessage({
        username: username,
        message: message
      });
      socket.emit('new message', message);
    }
  }

  function addMessage (data) {
    if (data) {
      messages.push(data);

      var html = '';
      for (var i = 0; i < messages.length; i++) {
        html += '<span class="user">' + messages[i].username + '</span>: ' + '<span class="message">' + messages[i].message + '</span><br />';
      }
      content.innerHTML = html;
    } else {
      console.log("Something went wrong");
    }
  }

  socket.on('new message', function (data) {
    addMessage(data);
  });

  socket.on('user joined', function (data) {
    console.log(data.username + ' is now connected');
    var html = '';
    html += data.username + ' joined<br />';
    content.innerHTML = html;
  });

  field.onkeypress = function (e) {
    if (!e)
      e = window.event;
    if (e.keyCode == '13') {
        sendMessage();
        return false;
    }
  }

  userInput.onkeypress = function (e) {
    if (!e)
      e = window.event;
    if (e.keyCode == '13') {
        setUsername();
        socket.emit('user joined', username);
        return false;
    }
  }

  send.onclick = function () {
    var text = field.value;
    socket.emit('send', { message: text });
  }

});
