const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('new user connected')

  socket.on('createMessage', (message) => {
    console.log('new message', message)

    io.emit('newMessage', {
      from: message.text,
      text: message.text,
      createdAt: new Date().getTime()  
    })
  })
  
  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))
