window.onload = function() {

  var messages = [];
  var socket = io.connect('http://localhost');
  var field = document.getElementById("field");
  var send = document.getElementById("send");
  var content = document.getElementById("content")

  socket.on('message', function (data) {
    if (data.message) {
      messages.push(data.message);
      console.log(data.message);

      var html = '';
      for (var i = 0; i < messages.length; i++) {
        html += messages[i] + '<br />';
      }

      content.innerHTML = html;
    } else {
      console.log("Something went wrong ...");
    }
  });

  send.onclick = function () {
    var text = field.value;
    socket.emit('send', { message: text });
  }

}
