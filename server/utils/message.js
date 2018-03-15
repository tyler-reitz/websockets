const moment = require('moment')

const generateMessage = (from, text) => ({
  from,
  text,
  createdAt: moment().valueOf()
})

const generateLocationMessage = (from, lat, long) => ({
  url: `https://www.google.com/maps?q=${lat},${long}`,
  createdAt: moment().valueOf()
})

module.exports = { generateMessage, generateLocationMessage }