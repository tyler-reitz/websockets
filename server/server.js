const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', socket => {
  console.log('new user connected')

  socket.emit('newMessage', {
    from: 'user1',
    text: 'sup',
    createdAt: new Date()
  })

  socket.on('createMessage', (newMessage) => {
    newMessage.createdAt = new Date()
    console.log('new message', newMessage)
  })
  
  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})

app.use(express.static(publicPath))

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))
