import PropTypes from 'prop-types';
import Modal from '../molecules/Modal';
import Button from '../atoms/Button';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', iconName = 'AlertTriangle', iconColor = 'red' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" showCloseButton={false} className="max-w-md">
      <div className="p-2">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 ${iconColor === 'red' ? 'bg-red-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
            <AppIcon name={iconName} className={`w-5 h-5 ${iconColor === 'red' ? 'text-red-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <Text variant="h3">{title}</Text>
            <Text variant="sm">{message}</Text>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700"
            variant="danger"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
};

export default ConfirmationModal;