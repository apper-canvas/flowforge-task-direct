import PropTypes from 'prop-types';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const PageError = ({ title = 'Something went wrong', message = 'An unexpected error occurred.', icon = 'AlertTriangle' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AppIcon name={icon} className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <Text variant="h2" className="mb-2">{title}</Text>
        <Text variant="body">{message}</Text>
      </div>
    </div>
  );
};

PageError.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.string,
};

export default PageError;