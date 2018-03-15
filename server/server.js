const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', socket => {

  // socket.emit from Admin text Welcom to the chat app
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'))
  
  // socket.broadcast.emit from Admin new user joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined!'))

  socket.on('createMessage', (message, callback) => {
    console.log('new message', message)

    io.emit('newMessage', generateMessage(message.from, message.text))
    callback('This is from the server')

    // socket.broadcast.emit('newMessage', {
    //   from: message.text,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.long))
  })
  
  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))
