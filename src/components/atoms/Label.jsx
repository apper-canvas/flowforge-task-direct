import PropTypes from 'prop-types';

const Label = ({ children, className = '', ...props }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${className}`} {...props}>
      {children}
    </label>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Label;