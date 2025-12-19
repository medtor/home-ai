import { useState, useCallback } from 'react';
// Avant: import { generateDesignDirect } from '../services/geminiApi';
import { generateDesign } from '../services/geminiApi'; // APRES
export const useDesignGeneration = () => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [designReport, setDesignReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async (originalImage, styleId, apiKey) => {
    if (!originalImage || !styleId) {
      setError('Image et style requis');
      return false;
    }

    setLoading(true);
    setError('');
    setGeneratedImage(null);
    setDesignReport('');

    try {
      const result = await generateDesignDirect(originalImage, styleId, apiKey);
      
      setGeneratedImage(result.image);
      setDesignReport(result.report);
      
      return true;
    } catch (err) {
      console.error('Erreur de génération:', err);
      
      let errorMessage = 'Une erreur est survenue lors de la génération.';
      
      if (err.message.includes('429')) {
        errorMessage = 'Trop de requêtes. Veuillez patienter quelques secondes.';
      } else if (err.message.includes('API')) {
        errorMessage = 'Erreur de communication avec le service. Réessayez.';
      } else if (err.message.includes('image')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setGeneratedImage(null);
    setDesignReport('');
    setError('');
  }, []);

  return {
    generatedImage,
    designReport,
    loading,
    error,
    generate,
    reset,
  };

};
