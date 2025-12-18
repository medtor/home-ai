export const getMimeTypeFromDataUrl = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return 'image/jpeg';
  }
  const match = dataUrl.match(/^data:([^;]+);base64,/);
  return match?.[1] ?? 'image/jpeg';
};

export const extractBase64Data = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return '';
  }
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : '';
};

export const compressImage = (file, maxWidth = 1920, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = event.target.result;
    };
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file, supportedFormats, maxSize) => {
  if (!file) {
    return { valid: false, error: 'Aucun fichier sélectionné' };
  }
  
  if (!supportedFormats.includes(file.type)) {
    return { 
      valid: false, 
      error: `Format non supporté. Utilisez: ${supportedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}` 
    };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `L'image dépasse ${maxSizeMB}MB. Veuillez la compresser.` };
  }
  
  return { valid: true };
};