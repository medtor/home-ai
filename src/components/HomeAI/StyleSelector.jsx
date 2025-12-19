import React from 'react';
import { Palette } from 'lucide-react';
import { DESIGN_STYLES } from '../../constants/styles';

const StyleSelector = React.memo(({ selectedStyle, onStyleSelect }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Palette className="w-4 h-4 text-indigo-600" aria-hidden="true" />
        Select Style
      </h3>
      <div 
        className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar"
        role="listbox"
        aria-label="Styles de design disponibles"
      >
        {DESIGN_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => onStyleSelect(style.id)}
              role="option"
              aria-selected={isSelected}
              className={`
                p-3 rounded-xl text-left transition-all border
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
                ${isSelected
                  ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50'
                  : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}
              `}
            >
              <div className="font-medium text-gray-900 text-sm">{style.name}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-1">{style.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

StyleSelector.displayName = 'StyleSelector';

export default StyleSelector;