const socket = io()

function scrollToBottom() {
  // selectors
  const messages = $('#message-list')
  const newMessage = messages.children('li:last-child')
  // heights
  const clientHeight = messages.prop('clientHeight')
  const scrollTop = messages.prop('scrollTop')
  const scrollHeight = messages.prop('scrollHeight')
  const newMessageHeight = newMessage.innerHeight()
  const lastMessageHeight = newMessage.prev().innerHeight()

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  }
}

socket.on('connect', () => {
  const params = $.deparam()

  socket.emit('join', params, (err) => {
    if (err) {
      alert(err)
      window.location.href = '/'
      return
    }

    console.log('No err')
  })
})

socket.on('disconnect', () => {
  console.log('disconnected from server')
})

socket.on('updateUserList', users => {
  console.log('users', users)

  const ol = $('<ol></ol>')

  users.forEach(user => {
    ol.append($("<li></li>").text(user))
  })

  $('#users').html(ol)
})

socket.on('newMessage', (message) => {
  const formattedTime = moment(message.createdAt).format('h:mm a')
  
  const template = $('#message-template').html()
  const html = Mustache.render(template, {
    text: message.text,
    createdAt: formattedTime
  })

  $('#message-list').append(html)

  scrollToBottom()
})

socket.on('newLocationMessage', (message) => {
  const formattedTime = moment(message.createdAt).format('h:mm a')

  const template = $('#location-message-template').html()
  const html = Mustache.render(template, {
    url: message.url,
    createdAt: formattedTime
  })

  $('#message-list').append(html)  

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