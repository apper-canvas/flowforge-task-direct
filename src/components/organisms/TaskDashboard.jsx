import { useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import AppIcon from '../atoms/AppIcon';
import Select from '../atoms/Select';
import TaskCard from './TaskCard'; // Assuming TaskCard is now an organism
import TaskForm from './TaskForm'; // Assuming TaskForm is now an organism
import Modal from '../molecules/Modal';
import ConfirmationModal from './ConfirmationModal';

const TaskDashboard = ({
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
  getUserById,
}) => {
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('dueDate');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const statusColumns = [
    { id: 'todo', title: 'To Do', color: 'gray' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'completed', title: 'Completed', color: 'green' }
  ];

  const handleTaskFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await onTaskUpdate(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        await onTaskCreate({
          ...taskData,
          status: 'todo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleTaskFormCancel = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await onTaskUpdate(taskId, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      await handleTaskStatusChange(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
  };

  const sortedTasks = tasks?.slice().sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'created':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  }) || [];

  const filteredTasks = showCompletedTasks 
    ? sortedTasks 
    : sortedTasks.filter(task => task.status !== 'completed');

  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t.status === 'completed').length || 0,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          </div>
        </div>
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <Text variant="h1">Tasks Overview</Text>
          <Text variant="body" className="mt-1">
            {stats.total} tasks • {stats.completed} completed
          </Text>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'list', icon: 'List', label: 'List' },
              { id: 'board', icon: 'Columns', label: 'Board' }
            ].map(view => (
              <Button
                key={view.id}
                variant="ghost"
                onClick={() => setViewMode(view.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm ${
                  viewMode === view.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <AppIcon name={view.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{view.label}</span>
              </Button>
            ))}
          </div>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm py-2 w-auto min-w-32"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="created">Created</option>
          </Select>

          <Button
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            className={`flex items-center space-x-1 px-3 py-2 text-sm ${
              showCompletedTasks
                ? 'bg-secondary text-white hover:bg-secondary-dark'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <AppIcon name="Eye" className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showCompletedTasks ? 'Hide' : 'Show'} Completed
            </span>
          </Button>
        </div>
      </div>

      {selectedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <Text variant="sm" className="font-medium !text-primary">
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </Text>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                className="text-sm"
                onClick={() => handleBulkAction('complete')}
              >
                Mark Complete
              </Button>
              <Button
                variant="secondary"
                className="text-sm !text-red-600 hover:bg-red-50"
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                className="text-sm"
                onClick={() => setSelectedTasks([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {viewMode === 'list' ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleTaskStatusChange}
                onEdit={setEditingTask}
                onDelete={setTaskToDelete}
                onDragStart={handleDragStart}
                getProjectById={getProjectById}
                getUserById={getUserById}
              />
            ))}
          </AnimatePresence>
          
          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AppIcon name="CheckCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text variant="h3" className="mb-2">
                No tasks found
              </Text>
              <Text variant="body">
                Create your first task to get started with FlowForge
              </Text>
              <Button
                onClick={() => setShowTaskModal(true)}
                className="mt-4"
              >
                <AppIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Task
              </Button>
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
                <Text variant="h4">{column.title}</Text>
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
                        onToggleComplete={handleTaskStatusChange}
                        onEdit={setEditingTask}
                        onDelete={setTaskToDelete}
                        onDragStart={handleDragStart}
                        getProjectById={getProjectById}
                        getUserById={getUserById}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showTaskModal || !!editingTask}
        onClose={handleTaskFormCancel}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        className="max-w-lg"
      >
        <TaskForm
          task={editingTask}
          projects={projects}
          users={users}
          onSubmit={handleTaskFormSubmit}
          onCancel={handleTaskFormCancel}
        />
      </Modal>

      <ConfirmationModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={async () => {
          await onTaskDelete(taskToDelete);
          setTaskToDelete(null);
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        iconName="Trash2"
      />
    </div>
  );
};

TaskDashboard.propTypes = {
  tasks: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onTaskCreate: PropTypes.func.isRequired,
  onTaskUpdate: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired,
  showTaskModal: PropTypes.bool.isRequired,
  setShowTaskModal: PropTypes.func.isRequired,
  getProjectById: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
};

export default TaskDashboard;