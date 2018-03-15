const socket = io()

function scrollToBottom() {
  // selectors
  const messages = $('#message-list')
  const newMessage = messages.children('li:last-child')
  console.log(newMessage)
  // heights
  const clientHeight = messages.prop('clientHeight')
  console.log('clientHieght', clientHeight)
  const scrollTop = messages.prop('scrollTop')
  console.log("scrollTop", scrollTop)
  const scrollHeight = messages.prop('scrollHeight')
  console.log("scrollHeight", scrollHeight)
  const newMessageHeight = newMessage.innerHeight()
  console.log('messageHeight', newMessageHeight)
  const lastMessageHeight = newMessage.prev().innerHeight()

  console.log(clientHeight + scrollTop + newMessageHeight + lastMessageHeight, scrollHeight)
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  }
}

socket.on('connect', () => {
  console.log('connected to server')  
})

socket.on('disconnect', () => {
  console.log('disconnected from server')
})

socket.on('newMessage', (message) => {
  const formattedTime = moment(message.createdAt).format("h:mm a")
  
  const template = $('#message-template').html()
  const html = Mustache.render(template, {
    text: message.text,
    createdAt: formattedTime
  })
  console.log(html)

  $('#message-list').append(html)

  scrollToBottom()
})

socket.on('newLocationMessage', (message) => {
  const formattedTime = moment(message.createdAt).format('h:mm a')

  const template = $("#location-message-template").html()
  const html = Mustache.render(template, {
    url: message.url,
    createdAt: formattedTime
  })

  $("#message-list").append(html)  

  // scrollToBottom()
})

socket.emit('createMessage', {
  from: 'frank',
  text: 'hallo'
}, (acknowledgement) => {
  console.log(acknowledgement)
})

// DOM manipulation
const form = document.getElementById('message-form')

form.addEventListener('submit', e => {
  e.preventDefault()

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: document.getElementById('message-input').value
    },
    () => {
      document.getElementById('message-input').value = ''
    }
  )
})


// Geolocation
const geoButton = document.getElementById('send-location')
geoButton.addEventListener('click', (e) => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  geoButton.setAttribute('disabled', 'disabled')
  geoButton.textContent = 'sending location…'
  
  navigator.geolocation.getCurrentPosition(
    position => {
      geoButton.removeAttribute('disabled')
      geoButton.textContent = 'send location'

      socket.emit('createLocationMessage', {
        long: position.coords.longitude,
        lat: position.coords.latitude
      })
    },
    () => {
      geoButton.setAttribute('disabled', 'disabled')
      geoButton.textContent = 'send location'
      alert('Unable to fetch location')
    }
  )
})