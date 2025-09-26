import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ModalContainer = ({
  isOpen = false,
  onClose,
  children,
  title,
  description,
  size = 'default',
  className = '',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  preventScroll = true
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }

      // Focus the modal
      if (modalRef?.current) {
        modalRef?.current?.focus();
      }
    } else {
      if (preventScroll) {
        document.body.style.overflow = '';
      }

      // Return focus to previous element
      if (previousActiveElement?.current) {
        previousActiveElement?.current?.focus();
      }
    }

    return () => {
      if (preventScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, preventScroll]);

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e?.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e?.target === e?.currentTarget && onClose) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e?.stopPropagation();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-6xl';
      case 'full':
        return 'max-w-[95vw] max-h-[95vh]';
      default:
        return 'max-w-2xl';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Enhanced Backdrop with better visibility */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all duration-300" />
      
      {/* Modal with improved glass styling */}
      <div
        ref={modalRef}
        className={`relative w-full ${getSizeClasses()} max-h-[90vh] glass-modal rounded-xl shadow-2xl animate-scale-in border-2 border-border/20 ${className}`}
        onClick={handleModalClick}
        tabIndex={-1}
      >
        {/* Header with better contrast */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border/40 bg-card/30 rounded-t-xl">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 
                  id="modal-title" 
                  className="text-lg font-semibold text-foreground truncate"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p 
                  id="modal-description" 
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-4 w-8 h-8 hover:bg-muted/60 flex-shrink-0 border border-border/20"
                aria-label="Close modal"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        )}

        {/* Content with enhanced background */}
        <div className="overflow-auto max-h-[calc(90vh-8rem)] bg-card/20 rounded-b-xl">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Modal Header Component
export const ModalHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-border/50 ${className}`}>
    {children}
  </div>
);

// Modal Body Component
export const ModalBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Modal Footer Component
export const ModalFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-border/50 flex items-center justify-end space-x-3 ${className}`}>
    {children}
  </div>
);

export default ModalContainer;