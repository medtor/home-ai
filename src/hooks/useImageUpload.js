import { useState, useCallback, useRef, useEffect } from 'react';
import { compressImage, validateImageFile } from '../utils/image';
import { API_CONFIG } from '../constants/styles';

export const useImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = useCallback(async (file) => {
    setError('');
    
    const validation = validateImageFile(
      file, 
      API_CONFIG.supportedFormats, 
      API_CONFIG.maxImageSize
    );
    
    if (!validation.valid) {
      setError(validation.error);
      return false;
    }

    setProcessing(true);

    try {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      const compressedImage = await compressImage(file, 1920, 0.85);
      setImage(compressedImage);
      
      return true;
    } catch (err) {
      console.error('Erreur de traitement image:', err);
      setError('Erreur lors du traitement de l\'image');
      return false;
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  }, [processFile]);

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearImage = useCallback(() => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
    setError('');
  }, [previewUrl]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return {
    image,
    previewUrl: previewUrl || image,
    processing,
    error,
    fileInputRef,
    handleFileChange,
    triggerUpload,
    clearImage,
    handleDrop,
    handleDragOver,
  };
};