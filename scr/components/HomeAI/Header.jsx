import React from 'react';
import { Armchair } from 'lucide-react';

const Header = React.memo(() => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Armchair className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Home <span className="text-indigo-600">AI</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <span>Upload</span>
          <span>Select Style</span>
          <span>Transform</span>
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;