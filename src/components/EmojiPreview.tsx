import { motion } from 'framer-motion';
import { GeneratedEmoji } from '../types.ts';
import StarBorder from './StarBorder.tsx';
import Masonry from './Masonry.tsx';

interface EmojiPreviewProps {
  emojis: GeneratedEmoji[];
  onDownload: (emoji: GeneratedEmoji) => void;
  onDownloadAll: () => void;
}

export function EmojiPreview({ emojis, onDownload, onDownloadAll }: EmojiPreviewProps) {
  if (emojis.length === 0) {
    return null;
  }

  // Convert emojis to Masonry items
  const masonryItems = emojis.map((emoji, index) => ({
    id: emoji.filename + '-' + index,
    img: emoji.canvas.toDataURL(),
    height: 120 + Math.random() * 80, // Varied heights for masonry effect
    name: emoji.name,
    onClick: () => onDownload(emoji)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">
          生成された絵文字 ({emojis.length}個)
        </h3>
        {emojis.length > 1 && (
          <StarBorder
            as="button"
            color="cyan"
            speed="4s"
            className="px-4 py-2"
            onClick={onDownloadAll}
          >
            すべてダウンロード (ZIP)
          </StarBorder>
        )}
      </div>

      <div>
        <Masonry
          items={masonryItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.08}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={1.05}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </div>
    </motion.div>
  );
}