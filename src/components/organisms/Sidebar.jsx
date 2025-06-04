import PropTypes from 'prop-types';
import Text from '../atoms/Text';
import StatCard from '../molecules/StatCard';
import HeaderLink from '../molecules/HeaderLink';
import ProjectLink from '../molecules/ProjectLink';
import ProjectColorDot from '../atoms/ProjectColorDot'; // Ensure this is imported if used elsewhere

const Sidebar = ({ 
  isCollapsed, 
  stats, 
  views, 
  selectedView, 
  onSelectView, 
  projects, 
  selectedProject, 
  onSelectProject,
  tasksCount // Total tasks count for 'All Projects'
}) => {
  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${isCollapsed ? '-translate-x-full lg:w-16' : 'translate-x-0'} transition-all duration-300 pt-14 lg:pt-0`}>
      <div className="flex flex-col h-full p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Completed" value={stats.completed} className="bg-gradient-to-br from-primary/10 to-primary/5 !text-primary" />
          <StatCard title="Overdue" value={stats.overdue} className="bg-gradient-to-br from-red-500/10 to-red-500/5 !text-red-500" />
        </div>

        <div className="space-y-2">
          <Text variant="h4" className="mb-3">Views</Text>
          {views.map(view => (
            <HeaderLink
              key={view.id}
              id={view.id}
              label={view.label}
              icon={view.icon}
              count={view.count}
              selected={selectedView === view.id}
              onClick={onSelectView}
            />
          ))}
        </div>

        <div className="space-y-2">
          <Text variant="h4" className="mb-3">Projects</Text>
          <ProjectLink
            id="all"
            name="All Projects"
            color="rgb(156, 163, 175)" // gray-400
            count={tasksCount}
            selected={selectedProject === 'all'}
            onClick={onSelectProject}
          />
          {projects?.map(project => (
            <ProjectLink
              key={project.id}
              id={project.id}
              name={project.name}
              color={project.color}
              count={project.taskCount}
              selected={selectedProject === project.id}
              onClick={onSelectProject}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    overdue: PropTypes.number.isRequired,
    today: PropTypes.number.isRequired,
  }).isRequired,
  views: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
icon: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
  selectedView: PropTypes.string.isRequired,
  onSelectView: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    taskCount: PropTypes.number.isRequired,
  })).isRequired,
  selectedProject: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSelectProject: PropTypes.func.isRequired,
  tasksCount: PropTypes.number.isRequired,
};

export default Sidebar;