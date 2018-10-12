/* load express */
const express = require('express')

/* load socket.io */
const socket = require('socket.io')

/* load Node.js default embedded module*/
const http = require('http')
const fs = require('fs')

/* generate express object */
const app = express()

/* generate express http server */
const server = http.createServer(app)

/* bind generated server with socket.io */
const io = socket(server)

/* RESTful api */

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response){
  
  fs.readFile('./static/index.html', function(err,data) {
    if(err) {
      response.send('Error occurred. Cannot load index.html')
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.write(data)
      response.end()
    }
  })
})

io.sockets.on('connection', function(socket) {

  socket.on('newUser', function(name) {
    console.log(name + '님이 접속하셨습니다.')
    socket.name = name
 
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하셨습니다.'})
  })

  socket.on('message', function(data) {
    data.name = socket.name
    console.log(data)

    /* 모든 유저에게 메세지 전송*/
    io.sockets.emit('update', data);
  })  

  socket.on('disconnect', function(){
    console.log(socket.name + '님이 나가셨습니다.')

    /* 나간 사람을 제외한 나머지 유저에게 메세지 전송 */
    socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'})
  })

})

/* set server to listen with 8080 port */
server.listen(8080, function(){
  console.log('server executing...')
})

