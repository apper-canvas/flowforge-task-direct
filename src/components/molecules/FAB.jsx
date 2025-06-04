import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import AppIcon from '../atoms/AppIcon';

const FAB = ({ onClick, iconName = 'Plus', className = '', ...props }) => {
  return (
    <Button
      onClick={onClick}
      className={`fab md:hidden ${className}`}
      {...props}
    >
      <AppIcon name={iconName} className="w-6 h-6" />
    </Button>
  );
};

FAB.propTypes = {
  onClick: PropTypes.func.isRequired,
  iconName: PropTypes.string,
  className: PropTypes.string,
};

export default FAB;