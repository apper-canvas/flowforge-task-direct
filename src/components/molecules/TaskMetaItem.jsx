import PropTypes from 'prop-types';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';
import ProjectColorDot from '../atoms/ProjectColorDot';

const TaskMetaItem = ({ iconName, text, color, isOverdue = false }) => {
  const textColorClass = isOverdue ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="flex items-center space-x-1">
      {iconName && <AppIcon name={iconName} className={`w-3 h-3 ${textColorClass}`} />}
      {color && <ProjectColorDot color={color} className="w-2 h-2" />}
      <Text variant="xs" className={`!text-xs ${textColorClass} ${color ? 'truncate max-w-20' : ''}`}>
        {text}
      </Text>
    </div>
  );
};

TaskMetaItem.propTypes = {
  iconName: PropTypes.string,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  isOverdue: PropTypes.bool,
};

export default TaskMetaItem;