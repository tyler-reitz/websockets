const expect = require('expect')

const { isRealString } = require('./validation')

describe('isRealString', () => {
  it('rejects non-string values', () => { 
    const params = 2
    expect(isRealString(params)).toBe(false)
  })

  it('rejects a string w/ only spaces', () => {
    const params = '   '
    expect(isRealString(params)).toBe(false)
  })

  it('allow a string w/ non-space chars', () => {
    const params = 'Hello=world'
    expect(isRealString(params)).toBe(true)
  })
})
