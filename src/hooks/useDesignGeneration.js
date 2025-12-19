import { useState, useCallback } from 'react';
import { generateDesign } from '../services/geminiApi'; // MODIFIÉ ICI

export const useDesignGeneration = () => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [designReport, setDesignReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async (originalImage, styleId) => { // 'apiKey' supprimé ici
    if (!originalImage || !styleId) {
      setError('Image et style requis');
      return false;
    }

    setLoading(true);
    setError('');
    setGeneratedImage(null);
    setDesignReport('');

    try {
      // Appelle la fonction generateDesign (qui utilise le proxy)
      const result = await generateDesign(originalImage, styleId); // 'apiKey' supprimé ici
      
      setGeneratedImage(result.image);
      setDesignReport(result.report);
      
      return true;
    } catch (err) {
      console.error('Erreur de génération via proxy:', err);
      
      let errorMessage = 'Une erreur est survenue lors de la génération.';
      
      if (err.status === 429) { // Vérifie le statut de l'erreur
        errorMessage = 'Trop de requêtes. Veuillez patienter quelques secondes.';
      } else if (err.status >= 500) {
        errorMessage = `Erreur serveur (${err.status}). Réessayez plus tard.`;
      } else if (err.message.includes('API') || err.message.includes('service')) {
        errorMessage = err.message; // Affiche le message plus spécifique du proxy
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
