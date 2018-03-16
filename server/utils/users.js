class Users {
  constructor() {
    this.users = []
  }

  // adduser (id, name, room)
  addUser(id, name, room) {
    const user = { id, name, room }
    this.users.push(user)
    return user
  }

  // removeUser (id)
  removeUser(id) {
    let removedUser

    this.users = this.users.filter(user => {
      if (user.id !== id) return user
      removedUser = user
    })

    return removedUser
  }
  
  // getUser (id)
  getUser(id) {
    const [desiredUser] = this.users.filter(user => user.id === id)
    return desiredUser
  }

  // getUserList (room)
  getUserList(room) {
    // return array of users
    const usersInRoom = this.users.filter(user => user.room === room)
    return usersInRoom.map(user => user.name)
  }
}

module.exports = Users