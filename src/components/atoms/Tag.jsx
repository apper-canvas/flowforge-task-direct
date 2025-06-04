import PropTypes from 'prop-types';

const Tag = ({ children, className = '' }) => {
  return (
    <span
      className={`px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Tag;