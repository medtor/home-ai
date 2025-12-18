import React, { useMemo } from 'react';

const MarkdownRenderer = React.memo(({ text }) => {
  const elements = useMemo(() => {
    if (!text || typeof text !== 'string') {
      return null;
    }

    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('###')) {
        return (
          <h3 
            key={idx} 
            className="text-xl font-bold text-gray-900 mt-6 mb-2 first:mt-0"
          >
            {trimmedLine.replace(/^###\s*/, '')}
          </h3>
        );
      }
      
      if (trimmedLine.startsWith('**') && trimmedLine.includes(':**')) {
        const match = trimmedLine.match(/^\*\*(.+?):\*\*\s*(.*)$/);
        if (match) {
          return (
            <div key={idx} className="mb-2">
              <span className="font-semibold text-indigo-700">{match[1]}:</span>
              <span className="text-gray-700"> {match[2]}</span>
            </div>
          );
        }
      }
      
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        return (
          <li 
            key={idx} 
            className="ml-4 list-disc marker:text-indigo-500 pl-1 text-gray-700 mb-1"
          >
            {trimmedLine.replace(/^[-•]\s*/, '')}
          </li>
        );
      }
      
      if (trimmedLine === '') {
        return <div key={idx} className="h-2" aria-hidden="true" />;
      }
      
      return (
        <p key={idx} className="text-gray-700 mb-2">
          {trimmedLine}
        </p>
      );
    });
  }, [text]);

  if (!elements) {
    return (
      <p className="text-gray-500 italic">Aucun rapport disponible.</p>
    );
  }

  return (
    <div className="space-y-1 text-gray-700 leading-relaxed">
      {elements}
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;