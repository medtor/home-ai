import React from 'react';
import { Layout } from 'lucide-react';

const PlaceholderState = React.memo(() => {
  return (
    <div className="h-full min-h-[400px] bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Layout className="w-10 h-10 text-gray-300" aria-hidden="true" />
      </div>
      <p className="text-lg font-medium text-gray-500">
        Your design transformation will appear here
      </p>
      <p className="text-sm text-gray-400 mt-2 text-center max-w-md">
        Select a photo and a style to see the magic happen. The AI will generate a photorealistic redesign and a detailed guide.
      </p>
    </div>
  );
});

PlaceholderState.displayName = 'PlaceholderState';

export default PlaceholderState;