var socket = io()

socket.on('connect', function() {
  
  var name = prompt('반갑습니다!', '')
  
  if(!name) {
    name = '익명'
  }

  socket.emit('newUser', name)
})

socket.on('update', function(data){
  console.log(`${data.name}:${data.message}`)
  var chat = document.getElementById('chat')
  var message = document.createElement('div')
  var node = document.createTextNode(`${data.name}: ${data.message}`)
  var className = ''

  switch(data.type){
    case 'message':
      className = 'other'
      break
    
    case 'connect':
      className = 'connect'
      break
    
    case 'disconnect':
      className = 'disconnect'
      break
  }
  message.classList.add('message')
  message.classList.add(className)
  message.appendChild(node)
  chat.appendChild(message)
})

/* send function */
function send() {
  var message = document.getElementById('test').value

  document.getElementById('test').value = ''

  socket.emit('message', {type:'message', message:message})
}

