import { API_CONFIG, DESIGN_STYLES } from '../constants/styles';
import { getMimeTypeFromDataUrl, extractBase64Data } from '../utils/image';

// buildDesignPrompt peut rester car le proxy l'utilise ou on pourrait l'envoyer comme paramètre
// Pour simplifier, nous allons le laisser côté client pour le moment, le proxy peut le recevoir

const buildDesignPrompt = (styleName) => `
You are an expert interior designer. Redesign the provided room image into a ${styleName} style. 
Maintain the original structural elements (walls, windows, ceiling height, door positions) but completely overhaul the furniture, decor, lighting, flooring and textures to fit the ${styleName} aesthetic perfectly. 
Make it look photorealistic and high-quality.

ALSO, provide a detailed interior design report in plain text (Markdown formatted) explaining the transformation.
Structure the text output exactly as follows:

### Design Summary
(2-3 sentences summarizing the new vibe)

### Key Visual Changes
- (Bullet point)
- (Bullet point)
- (bullet point)

### Recommendations
**Furniture:** (Specific suggestions)
**Decor:** (Art, textiles, plants)
**Color Palette:** (Specific colors/tones)
**Layout & Lighting:** (Placement and lighting tips)
`;

/**
 * Effectue une requête avec retry et backoff exponentiel
 * @param {Function} requestFn - La fonction de requête à exécuter
 * @param {number} retries - Nombre de tentatives restantes
 * @param {number} delay - Délai actuel en ms
 * @returns {Promise<any>} Le résultat de la requête
 */
const fetchWithRetry = async (requestFn, retries = API_CONFIG.maxRetries, delay = API_CONFIG.initialDelay) => {
  try {
    return await requestFn();
  } catch (err) {
    // Seulement retry pour les erreurs de serveur ou de limite de débit
    if (retries > 0 && (err.status === 429 || err.status >= 500)) {
      console.log(`Retry dans ${delay}ms... (${retries} tentatives restantes)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(requestFn, retries - 1, delay * 2);
    }
    throw err;
  }
};

/**
 * Parse la réponse de l'API Gemini (pas nécessaire avec le proxy qui renvoie déjà l'objet)
 * Gardé ici si la fonction proxy évolue ou si on revient à l'appel direct pour le dev.
 */
const parseGeminiResponse = (result) => {
    // Si le proxy renvoie déjà l'objet { image, report }, pas besoin de parser
    if (result.image && result.report) {
        return result;
    }
    // Logique de parsing si le proxy renvoie la réponse brute de Gemini
    const parts = result.candidates?.[0]?.content?.parts || [];
    
    let textOutput = '';
    let imageOutput = null;

    parts.forEach(part => {
        if (part.text) {
            textOutput += part.text;
        }
        if (part.inlineData) {
            imageOutput = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    });
    return { image: imageOutput, report: textOutput };
};

/**
 * Génère un design via un backend proxy (RECOMMANDÉ POUR PRODUCTION ET DÉVELOPPEMENT)
 * @param {string} imageDataUrl - L'URL data de l'image originale
 * @param {string} styleId - L'ID du style sélectionné
 * @returns {Promise<{ image: string, report: string }>}
 */
export const generateDesign = async (imageDataUrl, styleId) => {
  const base64Data = extractBase64Data(imageDataUrl);
  const mimeType = getMimeTypeFromDataUrl(imageDataUrl);
  const styleName = DESIGN_STYLES.find(s => s.id === styleId)?.name ?? styleId;

  const makeRequest = async () => {
    // Appel à votre fonction Netlify
    const response = await fetch('/.netlify/functions/generate-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: base64Data,
        mimeType,
        style: styleName,
        prompt: buildDesignPrompt(styleName) // Envoyer le prompt au proxy
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const error = new Error(errData.message || `Erreur serveur proxy: ${response.status}`);
      error.status = response.status; // Attacher le statut pour le retry
      throw error;
    }

    return response.json();
  };

  // Le proxy renvoie déjà un objet parsé { image, report }
  return fetchWithRetry(makeRequest);
};

// Exportez la fonction generateDesign comme étant la fonction principale
// Vous pouvez supprimer generateDesignDirect ou la garder pour référence si vous voulez
// mais dans useDesignGeneration, nous l'appellerons simplement generateDesign
