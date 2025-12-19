import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = React.memo(({ toast, onClose }) => {
  if (!toast) return null;

  const { message, type = 'success' } = toast;

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        animate-slide-up ${currentStyle.bg}
      `}
    >
      {currentStyle.icon}
      <span className={`text-sm font-medium ${currentStyle.text}`}>{message}</span>
      <button
        onClick={onClose}
        className={`ml-2 p-1 rounded hover:bg-black/5 transition-colors ${currentStyle.text}`}
        aria-label="Fermer la notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;