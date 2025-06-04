import PropTypes from 'prop-types';

const Text = ({ children, className = '', variant = 'body', ...props }) => {
  const variants = {
    h1: 'text-2xl md:text-3xl font-bold text-gray-900 dark:text-white',
    h2: 'text-xl font-semibold text-gray-900 dark:text-white',
    h3: 'text-lg font-medium text-gray-900 dark:text-white',
    h4: 'text-sm font-semibold text-gray-900 dark:text-white',
    body: 'text-gray-600 dark:text-gray-400',
    sm: 'text-sm text-gray-600 dark:text-gray-400',
    xs: 'text-xs text-gray-600 dark:text-gray-400',
    error: 'text-red-500',
  };

  const Component = ['h1', 'h2', 'h3', 'h4'].includes(variant) ? variant : 'p';

  return (
    <Component className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'body', 'sm', 'xs', 'error']),
};

export default Text;