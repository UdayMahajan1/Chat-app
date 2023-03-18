var username = localStorage.getItem('username');
var roomName = localStorage.getItem('roomName');

var socket = io({
  query: { username: username, roomName: roomName }
});

var form = document.getElementById('form');
var input = document.getElementById('input');

socket.on('Online Users', (html) => {
  $('#onlineUsers').empty();
  html.forEach((item) => {
    $('#onlineUsers').append(item);
  });
});

let timeout = null;

$('#input').on('input', () => {
  clearTimeout(timeout);
  socket.emit('is typing');

  timeout = setTimeout(() => {
    socket.emit('done typing');
  }, 2000);
});

form.addEventListener('submit', function (e) {
  // if u click on the send button the page reloads to prevent this kind of 
  // default action .preventDefault() method is used.
  e.preventDefault();
  if (input.value) {
    // the emit method emits the message to the server which broadcasts it to the rest of 
    // the clients after receiving it
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

$("#log-out").on('click', () => {
  socket.emit('log out request');
  fetch('/logOut', {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow'
  })
    .then(response => {
      if(response.redirected) {
        window.location.replace(response.url);
      }
    })
    .catch(err => console.log(err));
});

socket.on('Welcome', (msg) => {
  console.log(msg);
  $(".alert").removeClass("hide");
  setTimeout(function () {
    $('.alert').fadeOut(1000);
  }, 4000);
  setTimeout(() => {
    $('.alert').addClass("hide");
  }, 1000);
});

socket.on('is typing', (user) => {
  $('#input').attr('placeholder', `${user} is typing...`);
});

socket.on('done typing', () => {
  $('#input').removeAttr('placeholder');
});

socket.on('chat message', function (renderedChat) {
  $('#messages').append(renderedChat);
  window.scrollTo(0, document.body.scrollHeight);
});
