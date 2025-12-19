import { API_CONFIG, DESIGN_STYLES } from '../constants/styles.js'
import { getMimeTypeFromDataUrl, extractBase64Data } from '../utils/image.js'

var buildDesignPrompt = function(styleName) {
  return 'You are an expert interior designer. Redesign the provided room image into a ' + styleName + ' style. ' +
    'Maintain the original structural elements (walls, windows, ceiling height, door positions) but completely overhaul the furniture, decor, lighting, flooring and textures to fit the ' + styleName + ' aesthetic perfectly. ' +
    'Make it look photorealistic and high-quality.\n\n' +
    'ALSO, provide a detailed interior design report in plain text (Markdown formatted) explaining the transformation.\n' +
    'Structure the text output exactly as follows:\n\n' +
    '### Design Summary\n(2-3 sentences summarizing the new vibe)\n\n' +
    '### Key Visual Changes\n- (Bullet point)\n- (Bullet point)\n- (Bullet point)\n\n' +
    '### Recommendations\n' +
    '**Furniture:** (Specific suggestions)\n' +
    '**Decor:** (Art, textiles, plants)\n' +
    '**Color Palette:** (Specific colors/tones)\n' +
    '**Layout & Lighting:** (Placement and lighting tips)'
}

var sleep = function(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

var fetchWithRetry = async function(requestFn, retries, delay) {
  if (retries === undefined) retries = 3
  if (delay === undefined) delay = 2000
  
  try {
    return await requestFn()
  } catch (err) {
    console.log('API Error:', err.message, 'Status:', err.status, 'Retries left:', retries)
    
    if (retries > 0 && (err.status === 429 || err.status >= 500)) {
      console.log('Waiting ' + delay + 'ms before retry...')
      await sleep(delay)
      return fetchWithRetry(requestFn, retries - 1, delay * 2)
    }
    throw err
  }
}

var parseGeminiResponse = function(result) {
  var candidates = result.candidates
  if (!candidates || !candidates[0] || !candidates[0].content || !candidates[0].content.parts) {
    console.log('Invalid response structure:', JSON.stringify(result))
    return { image: null, report: '' }
  }
  
  var parts = candidates[0].content.parts
  var textOutput = ''
  var imageOutput = null
  
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i]
    if (part.text) {
      textOutput = textOutput + part.text
    }
    if (part.inlineData) {
      imageOutput = 'data:' + part.inlineData.mimeType + ';base64,' + part.inlineData.data
    }
  }
  
  return { image: imageOutput, report: textOutput }
}

export var generateDesignDirect = async function(imageDataUrl, styleId, apiKey) {
  // Vérification de la clé API
  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    console.error('API Key missing or invalid. Value:', apiKey)
    throw new Error('Clé API manquante. Veuillez configurer VITE_GEMINI_API_KEY dans les variables d\'environnement Netlify.')
  }
  
  console.log('API Key present, length:', apiKey.length)
  console.log('API Key starts with:', apiKey.substring(0, 10) + '...')
  
  var base64Data = extractBase64Data(imageDataUrl)
  var mimeType = getMimeTypeFromDataUrl(imageDataUrl)
  
  var style = null
  for (var i = 0; i < DESIGN_STYLES.length; i++) {
    if (DESIGN_STYLES[i].id === styleId) {
      style = DESIGN_STYLES[i]
      break
    }
  }
  var styleName = style ? style.name : styleId
  var prompt = buildDesignPrompt(styleName)
  
  console.log('Generating design for style:', styleName)
  console.log('Image data length:', base64Data.length)
  console.log('MIME type:', mimeType)

  var makeRequest = async function() {
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=' + apiKey
    
    console.log('Making request to Gemini API...')
    
    var response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { 
              inlineData: { 
                mimeType: mimeType, 
                data: base64Data 
              } 
            }
          ]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: 0.4
        }
      })
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      var errorText = await response.text()
      console.error('API Error Response:', errorText)
      
      var error = new Error('API Error: ' + response.status)
      error.status = response.status
      
      // Messages d'erreur plus explicites
      if (response.status === 400) {
        error.message = 'Requête invalide. Vérifiez le format de l\'image.'
      } else if (response.status === 401 || response.status === 403) {
        error.message = 'Clé API invalide ou non autorisée. Vérifiez votre clé sur Google AI Studio.'
      } else if (response.status === 404) {
        error.message = 'Modèle non trouvé. Le modèle gemini-2.0-flash-exp-image-generation peut ne pas être disponible.'
      } else if (response.status === 429) {
        error.message = 'Quota API dépassé. Attendez quelques minutes ou vérifiez vos limites sur Google Cloud Console.'
      } else if (response.status >= 500) {
        error.message = 'Erreur serveur Google. Réessayez dans quelques instants.'
      }
      
      throw error
    }
    
    var jsonResult = await response.json()
    console.log('Response received successfully')
    return jsonResult
  }

  var result = await fetchWithRetry(makeRequest, 3, 3000)
  var parsed = parseGeminiResponse(result)
  
  if (!parsed.image) {
    console.error('No image in response. Full response:', JSON.stringify(result))
    throw new Error('L\'API n\'a pas généré d\'image. Cela peut être dû à des restrictions de contenu ou un problème temporaire. Réessayez.')
  }
  
  console.log('Design generated successfully')
  return parsed
}
