import React, { useState, useCallback } from 'react';
import { Image as ImageIcon, Layout, Download, Share2 } from 'lucide-react';
import { DESIGN_STYLES } from '../../constants/styles';
import { copyToClipboard, downloadImage } from '../../utils/clipboard';
import MarkdownRenderer from '../ui/MarkdownRenderer';

const ResultsDisplay = React.memo(({
  generatedImage,
  originalImage,
  designReport,
  selectedStyle,
  onCopySuccess,
  onCopyError,
}) => {
  const [activeTab, setActiveTab] = useState('image');
  const styleName = DESIGN_STYLES.find(s => s.id === selectedStyle)?.name || 'Custom';

  const handleDownload = useCallback(() => {
    try {
      downloadImage(generatedImage, `homeai-redesign-${selectedStyle}.jpg`);
    } catch (err) {
      console.error('Erreur téléchargement:', err);
    }
  }, [generatedImage, selectedStyle]);

  const handleCopyReport = useCallback(async () => {
    try {
      await copyToClipboard(designReport);
      onCopySuccess?.();
    } catch (err) {
      onCopyError?.(err.message);
    }
  }, [designReport, onCopySuccess, onCopyError]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-fade-in">
      <div className="flex border-b border-gray-100" role="tablist">
        <button
          onClick={() => setActiveTab('image')}
          role="tab"
          aria-selected={activeTab === 'image'}
          aria-controls="panel-image"
          className={`
            flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors
            focus:outline-none focus:bg-gray-50
            ${activeTab === 'image'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-gray-500 hover:text-gray-700'}
          `}
        >
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
          Visual Transformation
        </button>
        <button
          onClick={() => setActiveTab('report')}
          role="tab"
          aria-selected={activeTab === 'report'}
          aria-controls="panel-report"
          className={`
            flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors
            focus:outline-none focus:bg-gray-50
            ${activeTab === 'report'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-gray-500 hover:text-gray-700'}
          `}
        >
          <Layout className="w-4 h-4" aria-hidden="true" />
          Design Report
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'image' && (
          <div id="panel-image" role="tabpanel" className="space-y-6 animate-fade-in">
            <div className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={generatedImage}
                alt={`Pièce redesignée en style ${styleName}`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleDownload}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-50 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Télécharger l'image redesignée"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Save Image
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="min-w-[150px] relative rounded-lg overflow-hidden border border-gray-200 opacity-75 hover:opacity-100 transition-opacity">
                <img
                  src={originalImage}
                  className="w-full h-24 object-cover"
                  alt="Photo originale de la pièce"
                />
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                  Original
                </div>
              </div>
              <div className="min-w-[150px] relative rounded-lg overflow-hidden border-2 border-indigo-500">
                <img
                  src={generatedImage}
                  className="w-full h-24 object-cover"
                  alt="Aperçu du nouveau design"
                />
                <div className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded">
                  Redesign
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div id="panel-report" role="tabpanel" className="animate-fade-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {styleName} Transformation
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  AI Analysis & Recommendations
                </p>
              </div>
              <button
                onClick={handleCopyReport}
                className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Copier le rapport"
                aria-label="Copier le rapport de design"
              >
                <Share2 className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="prose prose-indigo max-w-none bg-gray-50 p-6 rounded-xl border border-gray-200">
              <MarkdownRenderer text={designReport} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ResultsDisplay.displayName = 'ResultsDisplay';

export default ResultsDisplay;