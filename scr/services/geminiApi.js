import { API_CONFIG, DESIGN_STYLES } from '../constants/styles';
import { getMimeTypeFromDataUrl, extractBase64Data } from '../utils/image';

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
- (Bullet point)

### Recommendations
**Furniture:** (Specific suggestions)
**Decor:** (Art, textiles, plants)
**Color Palette:** (Specific colors/tones)
**Layout & Lighting:** (Placement and lighting tips)
`;

const fetchWithRetry = async (requestFn, retries = API_CONFIG.maxRetries, delay = API_CONFIG.initialDelay) => {
  try {
    return await requestFn();
  } catch (err) {
    if (retries > 0 && (err.status === 429 || err.status >= 500)) {
      console.log(`Retry dans ${delay}ms... (${retries} tentatives restantes)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(requestFn, retries - 1, delay * 2);
    }
    throw err;
  }
};

const parseGeminiResponse = (result) => {
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

export const generateDesignDirect = async (imageDataUrl, styleId, apiKey) => {
  if (!apiKey) {
    throw new Error('Clé API manquante. Configurez VITE_GEMINI_API_KEY.');
  }

  const base64Data = extractBase64Data(imageDataUrl);
  const mimeType = getMimeTypeFromDataUrl(imageDataUrl);
  const styleName = DESIGN_STYLES.find(s => s.id === styleId)?.name ?? styleId;
  const prompt = buildDesignPrompt(styleName);

  const makeRequest = async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            temperature: 0.4,
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      const error = new Error(`API Error: ${response.status} - ${errText}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  };

  const result = await fetchWithRetry(makeRequest);
  const { image, report } = parseGeminiResponse(result);

  if (!image) {
    throw new Error('L\'API n\'a pas généré d\'image. Veuillez réessayer.');
  }

  return { image, report };
};