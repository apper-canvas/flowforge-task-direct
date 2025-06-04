import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';
import SearchBar from '../molecules/SearchBar';
import Avatar from '../molecules/Avatar';

const AppHeader = ({ 
  onMenuToggle, 
  onAddTask, 
  darkMode, 
  onThemeToggle, 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg"
          >
            <AppIcon name="Menu" className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <AppIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <Text variant="h2" className="!text-xl font-bold">FlowForge</Text>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search tasks..."
            className="hidden md:block w-64"
            keyboardShortcut="⌘K"
          />
          
          <Button
            variant="primary"
            onClick={onAddTask}
            className="flex items-center space-x-1 text-sm"
          >
            <AppIcon name="Plus" className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={onThemeToggle}
            className="p-2 rounded-lg transition-colors"
          >
            <AppIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
          
          <Avatar />
        </div>
      </div>
    </header>
  );
};

AppHeader.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default AppHeader;