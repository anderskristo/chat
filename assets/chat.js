$(function() {

  var messages = [];
  var socket = io.connect();
  var field = $('#field');
  var content = $('#chat');
  var userInput = $('#username');
  var username;

  function setUsername () {
    username = userInput.val();
    if (username) {
      socket.emit('add user', username);
      $('.board').show();
      $('#username').hide();
    }
  }

  function usersOnline (data) {
    var message = '';
    if (data.users === 1) {
      message += "<span class=\"chat-message\">There's only 1 user currently online</span>";
    } else {
      message +="<span class=\"chat-message\">There are currently " + data.users + ' users online</span>';
    }
    content.append(message);
  }

  function sendMessage () {
    var message = field.val();

    if (message) {
      field.val('');
      addMessage({
        username: username,
        message: message
      });
      socket.emit('new message', message);
    }
  }

  function addMessage (data) {
    if (data.message) {
      var usernameElem = '<span class="user">' + data.username + ':</span>';
      var messageElem = '<span class="message">' + data.message + '</span>';
      var contentElem = $('<li>').append(usernameElem, messageElem);

      addChatElement(contentElem);
    }
  }

  function addChatElement (elem) {
    var elem = $(elem).fadeIn(200);
    content.append(elem);
    content[0].scrollTop = content[0].scrollHeight;
  }

  socket.on('login', function (data) {
    connected = true;
    usersOnline(data);
  });

  socket.on('new message', function (data) {
    addMessage(data);
  });

  socket.on('user joined', function (data) {
    console.log(data.username + ' is now connected');
    var html = '';
    html += data.username + ' joined<br />';
    content.append(html);
  });

  socket.on('user left', function (data) {
    console.log(data.username + ' left');
    var html = '';
    html += data.username + ' left<br />';
    content.append(html);
  });

  field.keypress(function (e) {
    if (!e)
      e = window.event;
    if(e.which == 13) {
      sendMessage();
      return false;
    }
  });

  userInput.keypress(function (e) {
    if (!e)
      e = window.event;
    if(e.which == 13) {
      setUsername();
      socket.emit('user joined', username);
      return false;
    }
  });

});
