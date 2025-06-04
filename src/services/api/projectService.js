import projectData from '../mockData/projects.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let projects = [...projectData]

const projectService = {
  async getAll() {
    await delay(250)
    return [...projects]
  },

  async getById(id) {
    await delay(200)
    const project = projects.find(p => p.id === id)
    if (!project) throw new Error('Project not found')
    return { ...project }
  },

  async create(projectData) {
    await delay(300)
    const newProject = {
      id: Date.now(),
      ...projectData,
      taskCount: 0,
      completedCount: 0
    }
    projects.unshift(newProject)
    return { ...newProject }
  },

  async update(id, updateData) {
    await delay(300)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')
    
    projects[index] = {
      ...projects[index],
      ...updateData
    }
    return { ...projects[index] }
  },

  async delete(id) {
    await delay(250)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')
    
    const deletedProject = projects.splice(index, 1)[0]
    return { ...deletedProject }
  }
}

export default projectService