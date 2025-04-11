import React, { createContext, useState, useContext } from 'react';
import AlertModal from '../components/AlertModal';

// Create a context for the alert system
export const AlertContext = createContext();

/**
 * AlertProvider component to wrap the application and provide alert functionality
 * This allows any component to display an alert modal without implementing it directly
 */
export const AlertProvider = ({ children }) => {
  // State for the alert modal
  const [alertState, setAlertState] = useState({
    show: false,
    title: 'Notice',
    message: '',
    variant: 'primary',
    buttonText: 'OK'
  });

  /**
   * Show an alert modal with the specified parameters
   * 
   * @param {Object} options - Alert modal options
   * @param {string} options.title - Modal title (default: 'Notice')
   * @param {string} options.message - Modal message (required)
   * @param {string} options.variant - Button variant (default: 'primary')
   * @param {string} options.buttonText - Button text (default: 'OK')
   */
  const showAlert = ({ 
    title = 'Notice', 
    message, 
    variant = 'primary',
    buttonText = 'OK' 
  }) => {
    setAlertState({
      show: true,
      title,
      message,
      variant,
      buttonText
    });
  };

  // Show a success alert (convenience method)
  const showSuccess = (message, title = 'Success') => {
    showAlert({ title, message, variant: 'success' });
  };

  // Show an error alert (convenience method)
  const showError = (message, title = 'Error') => {
    showAlert({ title, message, variant: 'danger' });
  };

  // Show an info alert (convenience method)
  const showInfo = (message, title = 'Information') => {
    showAlert({ title, message, variant: 'info' });
  };

  // Show a warning alert (convenience method)
  const showWarning = (message, title = 'Warning') => {
    showAlert({ title, message, variant: 'warning' });
  };

  // Close the alert modal
  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, show: false }));
  };

  return (
    <AlertContext.Provider value={{ 
      showAlert, 
      showSuccess, 
      showError, 
      showInfo,
      showWarning,
      hideAlert 
    }}>
      {children}
      
      {/* Global Alert Modal */}
      <AlertModal
        show={alertState.show}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        variant={alertState.variant}
        buttonText={alertState.buttonText}
      />
    </AlertContext.Provider>
  );
};

/**
 * Custom hook to use the alert context
 */
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 