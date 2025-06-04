import PropTypes from 'prop-types';
import Input from '../atoms/Input';
import AppIcon from '../atoms/AppIcon';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '', keyboardShortcut, ...props }) => {
  return (
    <div className={`relative ${className}`} {...props}>
      <AppIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2"
      />
      {keyboardShortcut && (
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
          {keyboardShortcut}
        </kbd>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  keyboardShortcut: PropTypes.string,
};

export default SearchBar;