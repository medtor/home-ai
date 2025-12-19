import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const ActionButton = React.memo(({ 
  disabled, 
  loading, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 
        transition-all shadow-lg
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${disabled || loading
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0'}
      `}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          <span>Redesigning...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          <span>Generate Design</span>
        </>
      )}
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

export default ActionButton;