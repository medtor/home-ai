import React from 'react';
import { Camera, X, RefreshCw, Loader2 } from 'lucide-react';

const UploadArea = React.memo(({
  previewUrl,
  processing,
  error,
  fileInputRef,
  onFileChange,
  onTriggerUpload,
  onClear,
  onDrop,
  onDragOver,
}) => {
  return (
    <div
      className={`
        border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 group
        ${previewUrl ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}
      `}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileChange}
        aria-label="Sélectionner une image"
      />

      {processing ? (
        <div className="py-8 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Traitement de l'image...</p>
        </div>
      ) : !previewUrl ? (
        <div
          className="cursor-pointer py-8"
          onClick={onTriggerUpload}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onTriggerUpload()}
          aria-label="Cliquer pour télécharger une photo"
        >
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Upload Room Photo</h3>
          <p className="text-sm text-gray-500 mt-2">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPEG, PNG, WebP • Max 4MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Photo de la pièce téléchargée"
            className="w-full h-48 object-cover rounded-lg shadow-sm"
          />
          <button
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Supprimer l'image"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={onTriggerUpload}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 mx-auto focus:outline-none focus:underline"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Change Photo
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

UploadArea.displayName = 'UploadArea';

export default UploadArea;