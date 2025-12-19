import React from 'react';
import { Sparkles } from 'lucide-react';
import { DESIGN_STYLES } from '../../constants/styles';

const LoadingState = React.memo(({ selectedStyle }) => {
  const styleName = DESIGN_STYLES.find(s => s.id === selectedStyle)?.name || 'selected';

  return (
    <div 
      className="h-full min-h-[400px] bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center p-8"
      role="status"
      aria-live="polite"
      aria-label="Génération du design en cours"
    >
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
        <Sparkles className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-pulse" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">Designing your dream space</h3>
      <div className="mt-4 space-y-1 text-center">
        <p className="text-gray-500">Analyzing room structure...</p>
        <p className="text-gray-500 text-sm">Applying {styleName} textures...</p>
        <p className="text-gray-500 text-sm">Generating lighting plan...</p>
      </div>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;