import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isOverdue, formatDistance } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ 
  tasks, 
  projects, 
  users, 
  loading, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete,
  showTaskModal,
  setShowTaskModal,
  getProjectById,
  getUserById
}) => {
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('dueDate')
  const [selectedTasks, setSelectedTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: '',
    assignee: '',
    tags: []
  })
  const [draggedTask, setDraggedTask] = useState(null)
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const priorityColors = {
    low: 'bg-gray-400',
    medium: 'bg-blue-500',
    high: 'bg-accent',
    urgent: 'bg-red-500'
  }

  const statusColumns = [
    { id: 'todo', title: 'To Do', color: 'gray' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'completed', title: 'Completed', color: 'green' }
  ]

  useEffect(() => {
    if (editingTask) {
      setTaskForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate || '',
        projectId: editingTask.projectId || '',
        assignee: editingTask.assignee || '',
        tags: editingTask.tags || []
      })
    } else {
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        projectId: '',
        assignee: '',
        tags: []
      })
    }
  }, [editingTask])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!taskForm.title.trim()) {
      toast.error("Task title is required")
      return
    }

    try {
      if (editingTask) {
        await onTaskUpdate(editingTask.id, taskForm)
        setEditingTask(null)
      } else {
        await onTaskCreate({
          ...taskForm,
          status: 'todo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        projectId: '',
        assignee: '',
        tags: []
      })
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await onTaskUpdate(taskId, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      
      if (newStatus === 'completed') {
        toast.success("🎉 Task completed! Great work!")
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleTaskComplete = async (taskId) => {
    const task = tasks?.find(t => t.id === taskId)
    if (!task) return
    
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    await handleTaskStatusChange(taskId, newStatus)
  }

  const handleBulkAction = async (action) => {
    try {
      if (action === 'delete') {
        for (const taskId of selectedTasks) {
          await onTaskDelete(taskId)
        }
        toast.success(`${selectedTasks.length} tasks deleted`)
      } else if (action === 'complete') {
        for (const taskId of selectedTasks) {
          await onTaskUpdate(taskId, { status: 'completed' })
        }
        toast.success(`${selectedTasks.length} tasks completed`)
      }
      setSelectedTasks([])
    } catch (error) {
      toast.error("Failed to perform bulk action")
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      await handleTaskStatusChange(draggedTask.id, newStatus)
    }
    setDraggedTask(null)
  }

  const sortedTasks = tasks?.slice().sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'created':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default:
        return 0
    }
  }) || []

  const filteredTasks = showCompletedTasks 
    ? sortedTasks 
    : sortedTasks.filter(task => task.status !== 'completed')

  const TaskCard = ({ task, isDragging = false }) => {
    const project = getProjectById(task.projectId)
    const user = getUserById(task.assignee)
    const isTaskOverdue = task.dueDate && isOverdue(new Date(task.dueDate)) && task.status !== 'completed'
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2 }}
        className={`task-card group cursor-pointer p-4 ${isDragging ? 'opacity-50' : ''} ${
          isTaskOverdue ? 'border-l-4 border-red-500' : ''
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onClick={() => setEditingTask(task)}
      >
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTaskComplete(task.id)
            }}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              task.status === 'completed'
                ? 'bg-secondary border-secondary'
                : 'border-gray-300 hover:border-primary'
            }`}
          >
            {task.status === 'completed' && (
              <ApperIcon name="Check" className="w-3 h-3 text-white checkmark-animate" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-center space-x-2 mb-2">
              <div className={`priority-dot ${priorityColors[task.priority]}`}></div>
              <h3 className={`font-medium text-gray-900 truncate ${
                task.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              {isTaskOverdue && (
                <span className="text-xs text-red-600 font-medium">Overdue</span>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Due Date */}
                {task.dueDate && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    isTaskOverdue ? 'text-red-600' : 
                    isToday(new Date(task.dueDate)) ? 'text-accent' : 
                    'text-gray-500'
                  }`}>
                    <ApperIcon name="Calendar" className="w-3 h-3" />
                    <span>
                      {isToday(new Date(task.dueDate)) 
                        ? 'Today'
                        : formatDistance(new Date(task.dueDate), new Date(), { addSuffix: true })
                      }
                    </span>
                  </div>
                )}

                {/* Project */}
                {project?.name && (
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <span className="text-xs text-gray-500 truncate max-w-20">
                      {project.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingTask(task)
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-3 h-3 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTaskToDelete(task.id)
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tags */}
            {task.tags?.length > 0 && (
              <div className="flex items-center space-x-1 mt-2">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{task.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Assignee Avatar */}
          {user?.name && (
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Task Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Tasks Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredTasks.length} tasks • {filteredTasks.filter(t => t.status === 'completed').length} completed
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'list', icon: 'List', label: 'List' },
              { id: 'board', icon: 'Columns', label: 'Board' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                  viewMode === view.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <ApperIcon name={view.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field text-sm py-2 w-auto min-w-32"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="created">Created</option>
          </select>

          {/* Show Completed Toggle */}
          <button
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              showCompletedTasks
                ? 'bg-secondary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showCompletedTasks ? 'Hide' : 'Show'} Completed
            </span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('complete')}
                className="btn-secondary text-sm"
              >
                Mark Complete
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn-secondary text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedTasks([])}
                className="btn-secondary text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tasks Content */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
          
          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="CheckCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first task to get started with FlowForge
              </p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="btn-primary mt-4"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map(column => (
            <div
              key={column.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {filteredTasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              
              <div className="space-y-3 min-h-64">
                <AnimatePresence>
                  {filteredTasks
                    .filter(task => task.status === column.id)
                    .map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Creation/Edit Modal */}
      <AnimatePresence>
        {(showTaskModal || editingTask) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowTaskModal(false)
                setEditingTask(null)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskModal(false)
                      setEditingTask(null)
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Add a description..."
                  />
                </div>

                {/* Priority and Due Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Project and Assignee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project
                    </label>
                    <select
                      value={taskForm.projectId}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">No Project</option>
                      {projects?.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assignee
                    </label>
                    <select
                      value={taskForm.assignee}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, assignee: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Unassigned</option>
                      {users?.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskModal(false)
                      setEditingTask(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {taskToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setTaskToDelete(null)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Task
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={async () => {
                      await onTaskDelete(taskToDelete)
                      setTaskToDelete(null)
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setTaskToDelete(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature