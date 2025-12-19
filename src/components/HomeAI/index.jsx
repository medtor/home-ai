import React, { useState, useCallback } from 'react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useDesignGeneration } from '../../hooks/useDesignGeneration';
import { useToast } from '../../hooks/useToast';

import Header from './Header';
import UploadArea from './UploadArea';
import StyleSelector from './StyleSelector';
import ActionButton from './ActionButton';
import PlaceholderState from './PlaceholderState';
import LoadingState from './LoadingState';
import ResultsDisplay from './ResultsDisplay';
import Footer from './Footer';
import Toast from '../ui/Toast';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const HomeAI = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  
  const {
    image: originalImage,
    previewUrl,
    processing: imageProcessing,
    error: uploadError,
    fileInputRef,
    handleFileChange,
    triggerUpload,
    clearImage,
    handleDrop,
    handleDragOver,
  } = useImageUpload();

  const {
    generatedImage,
    designReport,
    loading,
    error: generationError,
    generate,
    reset: resetGeneration,
  } = useDesignGeneration();

  const { toast, showToast, hideToast } = useToast();

  const handleClearImage = useCallback(() => {
    clearImage();
    resetGeneration();
    setSelectedStyle('');
  }, [clearImage, resetGeneration]);

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !selectedStyle) return;
    
    const success = await generate(originalImage, selectedStyle, API_KEY);
    
    if (success) {
      showToast('Design généré avec succès!', 'success');
    }
  }, [originalImage, selectedStyle, generate, showToast]);

  const handleCopySuccess = useCallback(() => {
    showToast('Rapport copié dans le presse-papiers!', 'success');
  }, [showToast]);

  const handleCopyError = useCallback((message) => {
    showToast(message || 'Erreur lors de la copie', 'error');
  }, [showToast]);

  const canGenerate = originalImage && selectedStyle && !loading && !imageProcessing;
  const showIntro = !generatedImage && !loading;
  const showPlaceholder = !generatedImage && !loading;
  const showLoading = loading;
  const showResults = generatedImage && !loading;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showIntro && (
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Redesign any room in seconds.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a photo of your space, choose a style, and let our AI architect visualize your dream home with professional design recommendations.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <UploadArea
              previewUrl={previewUrl}
              processing={imageProcessing}
              error={uploadError}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
              onTriggerUpload={triggerUpload}
              onClear={handleClearImage}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />

            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={setSelectedStyle}
            />

            <ActionButton
              disabled={!canGenerate}
              loading={loading}
              onClick={handleGenerate}
            />

            {generationError && (
              <div 
                className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100"
                role="alert"
              >
                {generationError}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {showPlaceholder && <PlaceholderState />}
            
            {showLoading && <LoadingState selectedStyle={selectedStyle} />}
            
            {showResults && (
              <ResultsDisplay
                generatedImage={generatedImage}
                originalImage={previewUrl}
                designReport={designReport}
                selectedStyle={selectedStyle}
                onCopySuccess={handleCopySuccess}
                onCopyError={handleCopyError}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
};

export default HomeAI;