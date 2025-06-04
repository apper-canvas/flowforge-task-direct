import userData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let users = [...userData]

const userService = {
  async getAll() {
    await delay(200)
    return [...users]
  },

  async getById(id) {
    await delay(150)
    const user = users.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return { ...user }
  },

  async create(userData) {
    await delay(300)
    const newUser = {
      id: Date.now(),
      ...userData,
      preferences: {
        theme: 'light',
        notifications: true,
        timeFormat: '12h'
      }
    }
    users.unshift(newUser)
    return { ...newUser }
  },

  async update(id, updateData) {
    await delay(300)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    
    users[index] = {
      ...users[index],
      ...updateData
    }
    return { ...users[index] }
  },

  async delete(id) {
    await delay(250)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    
    const deletedUser = users.splice(index, 1)[0]
    return { ...deletedUser }
  }
}

export default userService