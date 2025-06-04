import PropTypes from 'prop-types';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const ViewTabs = ({ activeView, onViewChange }) => {
  const tabs = [
    { id: 'list', label: 'List', icon: 'List' },
    { id: 'board', label: 'Board', icon: 'Columns' }
  ];

  return (
    <div className="view-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className={`view-tab ${activeView === tab.id ? 'active' : ''}`}
        >
          <AppIcon name={tab.icon} className="w-4 h-4" />
          <Text variant="sm" className="font-medium">
            {tab.label}
          </Text>
        </button>
      ))}
    </div>
  );
};

ViewTabs.propTypes = {
  activeView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default ViewTabs;