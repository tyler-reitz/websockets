const expect = require('expect')

const Users = require('./users')

describe('Users', () => {
  let users

  beforeEach(() => {
    users = new Users()
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Anne',
      room: 'Node Course'
    }, {
      id: '3',
      name: 'Dave',
      room: 'Web Assembly'
    }]
  })

  it('should add new users', () => {
    const users = new Users
    const name = 'tyler'
    const id = '123'
    const room = 'cheese'

    users.addUser(id, name, room)

    expect(users.users).toEqual([{id, room, name}])
  })

  it('should return names for node course', () => {
    const userList = users.getUserList('Node Course')

    expect(userList.length).toBe(2)
    expect(userList).toEqual(['Mike','Anne'])
  })

  it('should remove a user', () => {
    const removedUser = users.removeUser('2')

    expect(removedUser).toEqual({
      id: '2',
      name: 'Anne',
      room: 'Node Course'
    })

    expect(users.users.length).toBe(2)
  })

  it('should get a user by id', () => {
    const desiredUser = users.getUser('2')

    expect(desiredUser).toEqual(users.users[1])
  })
  
})
