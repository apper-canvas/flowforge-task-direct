import PropTypes from 'prop-types';
import AppIcon from '../atoms/AppIcon';

const Avatar = ({ name, iconName = 'User', className = '', ...props }) => {
  return (
    <div 
      className={`w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center ${className}`}
      {...props}
    >
      {name ? (
        <span className="text-xs text-white font-medium">
          {name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <AppIcon name={iconName} className="w-4 h-4 text-white" />
      )}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  iconName: PropTypes.string,
  className: PropTypes.string,
};

export default Avatar;