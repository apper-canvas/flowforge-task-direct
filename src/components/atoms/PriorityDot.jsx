import PropTypes from 'prop-types';

const PriorityDot = ({ priority }) => {
  const priorityColors = {
    low: 'bg-gray-400',
    medium: 'bg-blue-500',
    high: 'bg-accent',
    urgent: 'bg-red-500'
  };

  return (
    <div className={`priority-dot ${priorityColors[priority]}`}></div>
  );
};

PriorityDot.propTypes = {
  priority: PropTypes.oneOf(['low', 'medium', 'high', 'urgent']).isRequired,
};

export default PriorityDot;