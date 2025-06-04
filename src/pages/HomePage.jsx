import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, projectService, userService } from '../services';
import DashboardTemplate from '../components/templates/DashboardTemplate';
import PageError from '../components/organisms/PageError';
import TaskDashboard from '../components/organisms/TaskDashboard'; // Assuming TaskDashboard is now an organism

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

  return (
    <DashboardTemplate
      headerProps={headerProps}
      sidebarProps={sidebarProps}
      mainContent={
        <TaskDashboard
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
      }
      mobileSearchProps={mobileSearchProps}
      fabProps={fabProps}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
    />
  );
};

export default HomePage;