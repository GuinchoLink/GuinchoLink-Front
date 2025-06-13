import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`modal-dialog modal-${size} modal-dialog-centered`} onClick={handleOverlayClick}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {title.includes('Cliente') ? (
                <i className="bi bi-person-fill me-2 text-primary"></i>
              ) : (
                <i className="bi bi-gear-fill me-2 text-primary"></i>
              )}
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Fechar"
            ></button>
          </div>          <div className="modal-body p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
