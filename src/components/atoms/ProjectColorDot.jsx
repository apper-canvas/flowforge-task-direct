import PropTypes from 'prop-types';

const ProjectColorDot = ({ color, className = '' }) => {
  return (
    <div 
      className={`w-3 h-3 rounded-full ${className}`}
      style={{ backgroundColor: color }}
    ></div>
  );
};

ProjectColorDot.propTypes = {
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ProjectColorDot;