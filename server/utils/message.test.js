const expect = require('expect')

const { generateMessage, generateLocationMessage } = require('./message')

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'dave'
    const text = 'Hello world'

    const result = generateMessage(from, text)
    expect(result.from).toBe(from)
    expect(result.text).toBe(text)
    expect(result.createdAt).toBeA('number')
  })

  it('should generate the correct locaiton message', () => {
    const coords = { lat: 34.2181229, long: -118.58531440000002 }
    const expectedUrl = `https://www.google.com/maps?q=${coords.lat},${coords.long}`

    const result = generateLocationMessage('Admin', coords.lat, coords.long)

    expect(result.url).toBe(expectedUrl)
    expect(result.createdAt).toBeA('number')
  })
  
})
