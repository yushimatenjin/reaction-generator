import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAvailableFonts, loadGoogleFont } from '../fontLoader.ts';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (fontFamily: string) => void;
}

interface FontPreviewProps {
  fontName: string;
  isSelected: boolean;
  onClick: () => void;
}

function FontPreview({ fontName, isSelected, onClick }: FontPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGoogleFont(fontName).then((result) => {
      if (result.isOk()) {
        setIsLoaded(true);
      }
    });
  }, [fontName]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25' 
          : 'border-gray-600 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-700/60'
        }
        backdrop-blur-sm
      `}
    >
      <div className="text-center">
        <div className="text-sm font-medium text-gray-300 mb-2">
          {fontName}
        </div>
        <div 
          className={`text-lg text-white transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'}`}
          style={{ 
            fontFamily: isLoaded ? fontName : 'inherit',
            minHeight: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          あいうえお ABC 123
        </div>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

export function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const availableFonts = getAvailableFonts();

  const japaneseFonts = availableFonts.filter(font => 
    font.includes('JP') || 
    font.includes('Zen') || 
    font.includes('Kaisei') || 
    font.includes('Yuji') || 
    font.includes('Mochiy') || 
    font.includes('Reggae') || 
    font.includes('Stick') || 
    font.includes('BIZ') || 
    font.includes('Shippori') || 
    font.includes('New Tegomin') ||
    font.includes('M PLUS')
  );

  const otherFonts = availableFonts.filter(font => !japaneseFonts.includes(font));

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        フォントファミリー
      </label>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
        whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.9)' }}
      >
        <span style={{ fontFamily: selectedFont }}>
          {selectedFont}
        </span>
        <motion.svg 
          className="w-5 h-5"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-3 max-h-96 overflow-y-auto bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-lg p-4"
        >
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
              🏯 日本語フォント
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {japaneseFonts.map((font) => (
                <FontPreview
                  key={font}
                  fontName={font}
                  isSelected={selectedFont === font}
                  onClick={() => {
                    onFontChange(font);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
              🌍 欧文フォント
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherFonts.map((font) => (
                <FontPreview
                  key={font}
                  fontName={font}
                  isSelected={selectedFont === font}
                  onClick={() => {
                    onFontChange(font);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}