export const copyToClipboard = async (text) => {
  if (!text) {
    throw new Error('Aucun texte à copier');
  }

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API échouée, fallback vers méthode alternative:', err);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (!success) {
      throw new Error('execCommand copy a échoué');
    }
    
    return true;
  } catch (err) {
    throw new Error('Impossible de copier dans le presse-papiers');
  }
};

export const downloadImage = (dataUrl, filename) => {
  if (!dataUrl) {
    throw new Error('Aucune image à télécharger');
  }
  
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename || 'image.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};