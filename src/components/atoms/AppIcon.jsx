import * as LucideIcons from 'lucide-react';
import PropTypes from 'prop-types';

const AppIcon = ({ name, className = '', ...props }) => {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Using a fallback.`);
    return null; // Or a default icon
  }

  return <IconComponent className={className} {...props} />;
};

AppIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default AppIcon;