import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import ProjectColorDot from '../atoms/ProjectColorDot';

const ProjectLink = ({ id, name, color, count, selected, onClick }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
        selected
          ? 'bg-primary text-white hover:bg-primary-dark'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-center space-x-2">
        <ProjectColorDot color={color} className="w-3 h-3" />
        <Text variant="sm" className="truncate max-w-[120px]">{name}</Text>
      </div>
      <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
        {count}
</span>
    </Button>
  );
};

ProjectLink.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProjectLink;