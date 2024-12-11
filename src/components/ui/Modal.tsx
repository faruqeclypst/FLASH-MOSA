import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
};

const ModalContent: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-7xl',
    'full': 'max-w-[95%] w-[95%]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className={classNames(
                  'relative bg-white rounded-lg shadow-xl w-full',
                  sizeClasses[size],
                  className
                )}
                onClick={e => e.stopPropagation()}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const Modal: React.FC<ModalProps> = (props) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };

    if (props.isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [props.isOpen, props.onClose]);

  // Cleanup function untuk modal root
  useEffect(() => {
    return () => {
      const modalRoot = document.getElementById('modal-root')
      if (modalRoot && !modalRoot.hasChildNodes()) {
        modalRoot.remove()
      }
    }
  }, [])

  // Buat portal container jika belum ada
  let portalContainer = document.getElementById('modal-root')
  if (!portalContainer) {
    portalContainer = document.createElement('div')
    portalContainer.id = 'modal-root'
    document.body.appendChild(portalContainer)
  }

  return createPortal(
    <ModalContent {...props} />,
    portalContainer
  );
};

export default Modal; 