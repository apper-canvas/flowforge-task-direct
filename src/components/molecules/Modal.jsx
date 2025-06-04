import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../atoms/Button';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true, className = '', ...props }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        {...props}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`glass-panel w-full max-h-[90vh] overflow-y-auto ${className}`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Text variant="h3">{title}</Text>
              {showCloseButton && (
                <Button variant="ghost" onClick={onClose} className="p-2">
                  <AppIcon name="X" className="w-5 h-5" />
                </Button>
              )}
            </div>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;