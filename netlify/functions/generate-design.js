const fetch = require('node-fetch'); // Pour faire des requêtes HTTP côté serveur

// La clé API sera lue depuis les variables d'environnement de Netlify
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured in Netlify environment variables.');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error: API key missing.' })
    };
  }

  try {
    const { imageBase64, mimeType, style } = JSON.parse(event.body);

    if (!imageBase64 || !style) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Image data and style are required.' })
      };
    }

    const prompt = buildDesignPrompt(style);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
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
                    mimeType: mimeType || 'image/jpeg',
                    data: imageBase64
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
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          message: errorData.error?.message || `Error from AI service: ${response.status}`,
          details: errorData 
        })
      };
    }

    const result = await response.json();
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

    if (!imageOutput) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'AI failed to generate an image. Please try again.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        image: imageOutput,
        report: textOutput
      })
    };

  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error processing design request.' })
    };
  }
};