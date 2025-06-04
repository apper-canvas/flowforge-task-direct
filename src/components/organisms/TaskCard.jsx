import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { formatDistance, isToday, isOverdue } from 'date-fns';
import Checkbox from '../atoms/Checkbox';
import PriorityDot from '../atoms/PriorityDot';
import Text from '../atoms/Text';
import AppIcon from '../atoms/AppIcon';
import TaskMetaItem from '../molecules/TaskMetaItem';
import Avatar from '../molecules/Avatar';
import Button from '../atoms/Button';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, onDragStart, getProjectById, getUserById, isDragging = false }) => {
  const project = getProjectById(task.projectId);
  const user = getUserById(task.assignee);
  const isTaskOverdue = task.dueDate && isOverdue(new Date(task.dueDate)) && task.status !== 'completed';
  const isTaskToday = task.dueDate && isToday(new Date(task.dueDate));

  const priorityColors = {
    low: 'bg-gray-400',
    medium: 'bg-blue-500',
    high: 'bg-accent',
    urgent: 'bg-red-500'
  };

  const statusClass = task.status === 'completed' ? 'line-through text-gray-500' : '';

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
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={task.status === 'completed'}
          onChange={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <PriorityDot priority={task.priority} />
            <Text variant="h3" className={`!font-medium truncate ${statusClass}`}>
              {task.title}
            </Text>
            {isTaskOverdue && (
              <Text variant="xs" className="!text-red-600 font-medium">Overdue</Text>
            )}
          </div>

          {task.description && (
            <Text variant="sm" className="mb-3 line-clamp-2">
              {task.description}
            </Text>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {task.dueDate && (
                <TaskMetaItem 
                  iconName="Calendar" 
                  text={isTaskToday ? 'Today' : formatDistance(new Date(task.dueDate), new Date(), { addSuffix: true })}
                  isOverdue={isTaskOverdue}
                />
              )}
              {project?.name && (
                <TaskMetaItem 
                  text={project.name} 
                  color={project.color}
                />
              )}
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-1">
                <AppIcon name="Edit2" className="w-3 h-3 text-gray-400" />
              </Button>
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="p-1">
                <AppIcon name="Trash2" className="w-3 h-3 text-gray-400" />
              </Button>
            </div>
          </div>

          {task.tags?.length > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <Text variant="xs" className="!text-xs text-gray-500">+{task.tags.length - 3}</Text>
              )}
            </div>
          )}
        </div>

        {user?.name && <Avatar name={user.name} className="w-6 h-6" />}
      </div>
    </motion.div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  getProjectById: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
};

export default TaskCard;