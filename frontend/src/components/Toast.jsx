import { useEffect } from 'react';

/**
 * Toast Component
 * Beautiful notification toast for user feedback
 */
export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: '✓',
      shadow: 'shadow-lg shadow-green-500/50'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-500',
      icon: '✕',
      shadow: 'shadow-lg shadow-red-500/50'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      icon: 'ℹ',
      shadow: 'shadow-lg shadow-blue-500/50'
    }
  };

  const style = styles[type] || styles.success;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className={`${style.bg} ${style.shadow} rounded-2xl p-4 min-w-[280px] max-w-md transform transition-all`}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">{style.icon}</span>
          </div>
          
          {/* Message */}
          <p className="flex-1 text-white font-medium text-sm">
            {message}
          </p>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="text-white text-xs">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
}
