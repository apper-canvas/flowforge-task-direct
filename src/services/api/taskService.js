import taskData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...taskData]

const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    return { ...task }
  },

  async create(taskData) {
    await delay(400)
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.unshift(newTask)
    return { ...newTask }
  },

  async update(id, updateData) {
    await delay(350)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    tasks[index] = {
      ...tasks[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    const deletedTask = tasks.splice(index, 1)[0]
    return { ...deletedTask }
  }
}

export default taskService