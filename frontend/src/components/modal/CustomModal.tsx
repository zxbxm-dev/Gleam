import React, { ReactNode } from 'react';
import './CustomModal.scss';
import {
  ModalCloseBtn,
} from "../../assets/images/index";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  height?: string;
  header: ReactNode;
  children: ReactNode;
  footer1?: ReactNode;
  footer2?: ReactNode;
  footer3?: ReactNode;
  footer1Class?: string;
  footer2Class?: string;
  footer3Class?: string;
  onFooter1Click?: () => void;
  onFooter2Click?: () => void;
  onFooter3Click?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ 
    isOpen, 
    onClose, 
    width = '400px', 
    height = '200px', 
    header, 
    children, 
    footer1, 
    footer2, 
    footer3, 
    footer1Class = '', 
    footer2Class = '', 
    footer3Class = '',
    onFooter1Click,
    onFooter2Click,
    onFooter3Click,
  }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const footerElements = [
    { content: footer1, className: footer1Class, onClick: onFooter1Click },
    { content: footer2, className: footer2Class, onClick: onFooter2Click },
    { content: footer3, className: footer3Class, onClick: onFooter3Click },
  ].filter(footer => footer.content);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ width, height }}>
        <div className="modal-header">
          <div className="modal-header-text">
            {header}
          </div>
          <button className="modal-close-button" onClick={onClose}>
            <img className='Linker' src={ModalCloseBtn} alt="ModalCloseBtn" />
          </button>
        </div>

        <div className="modal-body" style={{ height: footerElements.length > 0 ? 'calc(100% - 34px - 20%)' : 'calc(100% - 34px)' }}>
          {children}
        </div>
        
        {footerElements.length > 0 && (
          <div className="modal-footer">
            {footerElements.map((footer, index) => (
              <button key={index} className={`modal-button ${footer.className}`} onClick={footer.onClick}>
                {footer.content}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
