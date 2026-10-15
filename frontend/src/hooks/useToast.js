import { useState, useCallback } from 'react';

/**
 * Custom hook to manage toast notifications and alert feedback.
 */
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showSuccess = useCallback((message) => {
    setToast({ message, type: 'success' });
  }, []);

  const showError = useCallback((message) => {
    setToast({ message, type: 'error' });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showSuccess,
    showError,
    hideToast,
  };
};

export default useToast;
