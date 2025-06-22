import { motion } from 'framer-motion';
import { EmojiPreset, DEFAULT_PRESETS } from '../types.ts';
import StarBorder from './StarBorder.tsx';

interface PresetSelectorProps {
  selectedPreset: EmojiPreset | null;
  onPresetSelect: (preset: EmojiPreset) => void;
}

export function PresetSelector({ selectedPreset, onPresetSelect }: PresetSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        スタイルプリセット
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {DEFAULT_PRESETS.map((preset) => (
          <motion.div
            key={preset.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 w-full max-w-xs ${selectedPreset?.id === preset.id
              ? 'ring-4 ring-cyan-400 shadow-xl shadow-cyan-400/30 bg-gray-700/20'
              : 'hover:ring-2 hover:ring-gray-400 hover:shadow-lg hover:bg-gray-700/10'
              }`}
            onClick={() => onPresetSelect(preset)}
          >
            <div className="flex justify-center items-center p-4">
              <div
                className="w-32 h-32 flex items-center justify-center text-center relative"
                style={{
                  backgroundColor: preset.style.backgroundColor,
                  opacity: preset.style.backgroundOpacity,
                  color: preset.style.textColor,
                  fontFamily: preset.style.fontFamily,
                  fontWeight: preset.style.fontWeight,
                  fontSize: `${preset.style.fontSize * 0.8}px`,
                  border: preset.style.borderWidth > 0
                    ? `${preset.style.borderWidth}px solid ${preset.style.borderColor}`
                    : 'none',
                  borderRadius: preset.style.shape === 'circle' ? '50%' : '8px',
                  boxShadow: preset.style.shadowEnabled
                    ? `0 0 ${preset.style.shadowBlur}px ${preset.style.shadowColor}`
                    : 'none'
                }}
              >
                <span className="font-medium">あ</span>

                {selectedPreset?.id === preset.id && (
                  <div className="absolute inset-0 pointer-events-none opacity-80" />
                )}
              </div>
            </div>

            <div className="p-3 bg-gray-900/90 backdrop-blur-sm">
              <h4 className="text-white font-medium text-sm mb-1">
                {preset.name}
              </h4>
              <p className="text-gray-400 text-xs">
                {preset.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPreset && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg  backdrop-blur-sm"
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-white font-semibold text-lg">選択中: {selectedPreset.name}</h4>
              <p className="text-cyan-200 text-sm mt-1">{selectedPreset.description}</p>
            </div>
            <StarBorder
              as="div"
              color="cyan"
              speed="3s"
              className="px-4 py-2 text-sm font-medium"
            >
              適用中
            </StarBorder>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}