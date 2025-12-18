export const DESIGN_STYLES = [
  { 
    id: 'modern', 
    name: 'Modern', 
    desc: 'Clean lines, neutral palette, functional', 
    color: 'bg-zinc-100' 
  },
  { 
    id: 'industrial', 
    name: 'Industrial', 
    desc: 'Raw materials, exposed textures, metal', 
    color: 'bg-stone-200' 
  },
  { 
    id: 'tropical', 
    name: 'Tropical', 
    desc: 'Warm woods, greenery, natural fabrics', 
    color: 'bg-green-100' 
  },
  { 
    id: 'zen', 
    name: 'Zen', 
    desc: 'Soft lighting, minimalism, earthy tones', 
    color: 'bg-amber-50' 
  },
  { 
    id: 'scandinavian', 
    name: 'Scandinavian', 
    desc: 'Functional, simple, cozy light hues', 
    color: 'bg-blue-50' 
  },
  { 
    id: 'bohemian', 
    name: 'Bohemian', 
    desc: 'Eclectic, patterns, vibrant layers', 
    color: 'bg-orange-100' 
  },
  { 
    id: 'mid-century', 
    name: 'Mid-Century', 
    desc: 'Retro, organic curves, functional', 
    color: 'bg-yellow-100' 
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    desc: 'Simplicity, monochromatic, open space', 
    color: 'bg-gray-100' 
  },
  { 
    id: 'coastal', 
    name: 'Coastal', 
    desc: 'Breezy, blue & white, natural light', 
    color: 'bg-sky-100' 
  },
  { 
    id: 'farmhouse', 
    name: 'Farmhouse', 
    desc: 'Rustic, warm, traditional touches', 
    color: 'bg-amber-100' 
  },
];

export const API_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxImageSize: 4 * 1024 * 1024,
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};