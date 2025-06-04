import PropTypes from 'prop-types';
import Text from '../atoms/Text';

const StatCard = ({ title, value, className = '' }) => {
  return (
    <div className={`p-3 rounded-xl ${className}`}>
      <Text variant="h2" className="!text-2xl font-bold mb-1">{value}</Text>
      <Text variant="xs" className="!text-xs">{title}</Text>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default StatCard;