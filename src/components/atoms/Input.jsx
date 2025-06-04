import PropTypes from 'prop-types';

const Input = ({ type = 'text', className = '', ...props }) => {
  const baseClasses = 'w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200';
  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Input;