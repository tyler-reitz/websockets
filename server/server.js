const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const Users = require('./utils/users')

const publicPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const users = new Users()

app.use(express.static(publicPath))

io.on('connection', socket => {

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name or room must be a string')
    }

    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)

    // emit user list
    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    // socket.emit from Admin text Welcom to the chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'))
  
    // socket.broadcast.emit from Admin new user joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))

    callback()
  })

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id)

    if (user && isRealString(message.text)) {
      io.to(user.room).emit("newMessage", generateMessage(user.name, message.text))      
    }
  })

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id)
    
    if (user) {
      console.log("User", user)      
      io.to(user.room).emit("newLocationMessage", generateLocationMessage('Admin', coords.lat, coords.long))
    }
  })
  
  socket.on('disconnect', () => {
    console.log('client disconnected')

    const user = users.removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `User: ${user.name} left the room`))
    }
  })
})

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))
