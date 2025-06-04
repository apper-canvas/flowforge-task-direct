import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const HeaderLink = ({ id, label, icon, count, selected, onClick }) => {
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
        <AppIcon name={icon} className="w-4 h-4" />
        <Text variant="sm">{label}</Text>
      </div>
      <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
        {count}
      </span>
    </Button>
  );
};

HeaderLink.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HeaderLink;