import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { taskService, projectService, userService } from '../services'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedView, setSelectedView] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tasksResult, projectsResult, usersResult] = await Promise.all([
          taskService.getAll(),
          projectService.getAll(),
          userService.getAll()
        ])
        setTasks(tasksResult || [])
        setProjects(projectsResult || [])
        setUsers(usersResult || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      setShowTaskModal(false)
      toast.success("Task created successfully!")
    } catch (err) {
      toast.error("Failed to create task")
    }
  }

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      const updatedTask = await taskService.update(taskId, updateData)
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))
      toast.success("Task updated successfully!")
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success("Task deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete task")
    }
  }

  const filteredTasks = tasks?.filter(task => {
    if (!task) return false
    
    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject
    const matchesView = selectedView === 'all' || 
      (selectedView === 'today' && isToday(task.dueDate)) ||
      (selectedView === 'upcoming' && isUpcoming(task.dueDate)) ||
      (selectedView === 'completed' && task.status === 'completed')
    const matchesSearch = !searchQuery || 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesProject && matchesView && matchesSearch
  }) || []

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    const taskDate = new Date(date)
    return taskDate.toDateString() === today.toDateString()
  }

  const isUpcoming = (date) => {
    if (!date) return false
    const today = new Date()
    const taskDate = new Date(date)
    return taskDate > today
  }

  const getProjectById = (projectId) => {
    return projects?.find(p => p.id === projectId) || {}
  }

  const getUserById = (userId) => {
    return users?.find(u => u.id === userId) || {}
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const getTaskStats = () => {
    const total = tasks?.length || 0
    const completed = tasks?.filter(t => t.status === 'completed').length || 0
    const overdue = tasks?.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false
      return new Date(t.dueDate) < new Date()
    }).length || 0
    const today = tasks?.filter(t => isToday(t.dueDate)).length || 0
    
    return { total, completed, overdue, today }
  }

  const stats = getTaskStats()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FlowForge</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
            
            {/* Quick Add */}
            <button
              onClick={() => setShowTaskModal(true)}
              className="btn-primary flex items-center space-x-1 text-sm"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${sidebarCollapsed ? '-translate-x-full lg:w-16' : 'translate-x-0'} transition-all duration-300 pt-14 lg:pt-0`}>
          <div className="flex flex-col h-full p-4 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-3 rounded-xl">
                <div className="text-2xl font-bold text-primary">{stats.completed}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-3 rounded-xl">
                <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Overdue</div>
              </div>
            </div>

            {/* Views */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Views</h3>
              {[
                { id: 'all', label: 'All Tasks', icon: 'List', count: stats.total },
                { id: 'today', label: 'Today', icon: 'Calendar', count: stats.today },
                { id: 'upcoming', label: 'Upcoming', icon: 'Clock', count: tasks?.filter(t => isUpcoming(t.dueDate)).length || 0 },
                { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: stats.completed }
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    selectedView === view.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={view.icon} className="w-4 h-4" />
                    <span className="text-sm">{view.label}</span>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    {view.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Projects</h3>
              <button
                onClick={() => setSelectedProject('all')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                  selectedProject === 'all'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">All Projects</span>
                </div>
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                  {tasks?.length || 0}
                </span>
              </button>
              {projects?.map(project => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    selectedProject === project.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <span className="text-sm truncate">{project.name}</span>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    {tasks?.filter(t => t.projectId === project.id).length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Main Feature Component */}
          <MainFeature
            tasks={filteredTasks}
            projects={projects}
            users={users}
            loading={loading}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            showTaskModal={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            getProjectById={getProjectById}
            getUserById={getUserById}
          />
        </main>
      </div>

      {/* Mobile Search Overlay */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg"
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowTaskModal(true)}
        className="fab md:hidden"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}

export default Home