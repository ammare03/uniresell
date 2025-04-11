import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Reusable Alert Modal component to replace JavaScript alerts
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message content
 * @param {string} props.variant - Button variant (primary, success, danger, etc.)
 * @param {string} props.buttonText - Text to display on the button
 */
const AlertModal = ({ 
  show, 
  onClose, 
  title = 'Notice', 
  message, 
  variant = 'primary',
  buttonText = 'OK'
}) => {
  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered
      animation={true}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={variant} onClick={onClose}>
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal; 