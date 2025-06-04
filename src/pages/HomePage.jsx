import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, projectService, userService } from '../services';
import DashboardTemplate from '../templates/DashboardTemplate';
import PageError from '../components/organisms/PageError';
import TaskDashboard from '../components/organisms/TaskDashboard';
const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [selectedProject, setSelectedProject] = useState('all');
  const [selectedView, setSelectedView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tasksResult, projectsResult, usersResult] = await Promise.all([
          taskService.getAll(),
          projectService.getAll(),
          userService.getAll()
        ]);
        setTasks(tasksResult || []);
        setProjects(projectsResult || []);
        setUsers(usersResult || []);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowTaskModal(false);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      const updatedTask = await taskService.update(taskId, updateData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
toast.error("Failed to delete task");
    }
  };

  const handleBulkAction = async (action, taskIds) => {
    try {
      switch (action) {
        case 'delete':
          await Promise.all(taskIds.map(id => taskService.delete(id)));
          setTasks(prev => prev.filter(task => !taskIds.includes(task.id)));
          toast.success(`${taskIds.length} tasks deleted successfully!`);
          break;
        case 'complete':
          await Promise.all(taskIds.map(id => taskService.update(id, { status: 'completed' })));
          setTasks(prev => prev.map(task => 
            taskIds.includes(task.id) ? { ...task, status: 'completed' } : task
          ));
          toast.success(`${taskIds.length} tasks marked as completed!`);
          break;
        default:
          break;
      }
      setSelectedTasks([]);
    } catch (err) {
      toast.error(`Failed to ${action} tasks`);
    }
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    const taskDate = new Date(date);
    return taskDate.toDateString() === today.toDateString();
  };

  const isUpcoming = (date) => {
    if (!date) return false;
    const today = new Date();
    const taskDate = new Date(date);
    return taskDate > today;
  };

  const getProjectById = (projectId) => {
    return projects?.find(p => p.id === projectId) || {};
  };

  const getUserById = (userId) => {
    return users?.find(u => u.id === userId) || {};
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getTaskStats = () => {
    const total = tasks?.length || 0;
    const completed = tasks?.filter(t => t.status === 'completed').length || 0;
    const overdue = tasks?.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length || 0;
    const today = tasks?.filter(t => isToday(t.dueDate)).length || 0;
    
    return { total, completed, overdue, today };
  };

  const stats = getTaskStats();

  const filteredTasks = tasks?.filter(task => {
    if (!task) return false;
    
    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;
    const matchesView = selectedView === 'all' || 
      (selectedView === 'today' && isToday(task.dueDate)) ||
      (selectedView === 'upcoming' && isUpcoming(task.dueDate)) ||
      (selectedView === 'completed' && task.status === 'completed');
    const matchesSearch = !searchQuery || 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
return matchesProject && matchesView && matchesSearch;
  }) || [];

  const sortedTasks = filteredTasks.sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
    }
  });

  const headerProps = {
    onMenuToggle: () => setSidebarCollapsed(!sidebarCollapsed),
    onAddTask: () => setShowTaskModal(true),
    darkMode,
    onThemeToggle: toggleDarkMode,
    searchQuery,
    onSearchChange: (e) => setSearchQuery(e.target.value),
  };

  const sidebarProps = {
    stats,
    views: [
      { id: 'all', label: 'All Tasks', icon: 'List', count: stats.total },
      { id: 'today', label: 'Today', icon: 'Calendar', count: stats.today },
      { id: 'upcoming', label: 'Upcoming', icon: 'Clock', count: tasks?.filter(t => isUpcoming(t.dueDate)).length || 0 },
      { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: stats.completed }
    ],
    selectedView,
    onSelectView: setSelectedView,
    projects: projects?.map(p => ({ 
      ...p, 
      taskCount: tasks?.filter(t => t.projectId === p.id).length || 0 
    })) || [],
    selectedProject,
    onSelectProject: setSelectedProject,
    tasksCount: tasks?.length || 0, // Total tasks count for 'All Projects'
  };

  const mobileSearchProps = {
    value: searchQuery,
    onChange: (e) => setSearchQuery(e.target.value),
    placeholder: "Search tasks...",
    className: "w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg",
  };

  const fabProps = {
    onClick: () => setShowTaskModal(true),
  };

  if (error) {
return <PageError message={error} />;
  }

  const filterBarProps = {
    viewMode,
    onViewModeChange: setViewMode,
    sortBy,
    onSortByChange: setSortBy,
    showCompletedTasks,
    onToggleCompletedTasks: setShowCompletedTasks,
    priorityFilter,
    onPriorityFilterChange: setPriorityFilter,
    assigneeFilter,
    onAssigneeFilterChange: setAssigneeFilter,
    statusFilter,
    onStatusFilterChange: setStatusFilter,
    dateRange,
    onDateRangeChange: setDateRange,
    projects,
    users,
    selectedTasks,
    onBulkAction: handleBulkAction,
    onClearSelection: () => setSelectedTasks([])
  };

  return (
    <DashboardTemplate
      headerProps={headerProps}
      sidebarProps={sidebarProps}
      mainContent={
        <TaskDashboard
          tasks={sortedTasks}
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
          viewMode={viewMode}
          selectedTasks={selectedTasks}
          onTaskSelection={setSelectedTasks}
          filterBarProps={filterBarProps}
        />
      }
      mobileSearchProps={mobileSearchProps}
      fabProps={fabProps}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
    />
  );
};

export default HomePage;