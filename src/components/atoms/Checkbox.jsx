import PropTypes from 'prop-types';
import AppIcon from './AppIcon'; // Assuming AppIcon is available

const Checkbox = ({ checked, onChange, className = '', ...props }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
        checked
          ? 'bg-secondary border-secondary'
          : 'border-gray-300 hover:border-primary'
      } ${className}`}
      {...props}
    >
      {checked && (
        <AppIcon name="Check" className="w-3 h-3 text-white checkmark-animate" />
      )}
    </button>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Checkbox;