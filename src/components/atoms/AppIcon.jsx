import PropTypes from 'prop-types';
import * as FeatherIcons from 'react-feather';

const AppIcon = ({ name, className = '', ...props }) => {
  const IconComponent = FeatherIcons[name];

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