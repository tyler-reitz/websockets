const socket = io()

socket.on('connect', () => {
  console.log('connected to server')  

  socket.emit('createMessage', {
    from: 'user2',
    text: 'dunno'
  })
})

socket.on('disconnect', () => {
  console.log('disconnected from server')
})

socket.on('newMessage', (message) => {
  console.log('new email', message)
})

socket.on('newMessage', (newMessage) => {
  console.log(newMessage)
})