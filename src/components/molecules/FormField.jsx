import PropTypes from 'prop-types';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

const FormField = ({ label, type = 'text', value, onChange, options, className = '', children, ...props }) => {
  const renderInput = () => {
    if (type === 'select') {
      return (
        <Select value={value} onChange={onChange} {...props}>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    } else if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={onChange}
          className={`input-field resize-none ${className}`}
          rows={3}
          {...props}
        />
      );
    } else {
      return (
        <Input
          type={type}
          value={value}
          onChange={onChange}
          className={className}
          {...props}
        />
      );
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      {renderInput()}
      {children}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'datetime-local', 'select', 'textarea']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default FormField;