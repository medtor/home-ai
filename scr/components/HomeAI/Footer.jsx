import React from 'react';

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-200 py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>© {currentYear} Home AI. Powered by Gemini 2.0 Flash.</p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;