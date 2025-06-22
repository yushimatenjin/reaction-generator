import { useState } from 'react';
import { motion } from 'framer-motion';
import { SplitText } from './components/SplitText.tsx';
import { GlowingText } from './components/GlowingText.tsx';
import { TextInput } from './components/TextInput.tsx';
import { EmojiStyleControls } from './components/EmojiStyleControls.tsx';
import { EmojiPreview } from './components/EmojiPreview.tsx';
import { LivePreview } from './components/LivePreview.tsx';
import { AnimatedButton } from './components/AnimatedButton.tsx';
import { FadeInContainer } from './components/FadeInContainer.tsx';
import { FontSelector } from './components/FontSelector.tsx';
import StarBorder from './components/StarBorder.tsx';
import DotGrid from './components/DotGrid.tsx';
import { useEmojiGenerator } from './hooks/useEmojiGenerator.ts';
import { downloadEmoji, downloadAllEmojis } from './utils/downloadManager.ts';
import { EmojiStyle, EmojiPreset } from './types.ts';

const defaultStyle: EmojiStyle = {
  fontFamily: 'Noto Sans JP',
  fontWeight: '500',
  fontStyle: 'normal',
  fontSize: 48,
  backgroundColor: '#ffffff',
  backgroundOpacity: 1,
  textColor: '#000000',
  shape: 'circle',
  layout: 'auto',
  padding: 8,
  borderWidth: 0,
  borderColor: '#000000',
  shadowEnabled: true,
  shadowColor: '#000000',
  shadowBlur: 4,
  highlightEnabled: false,
  highlightColor: '#ffffff',
  highlightSize: 0.3,
  highlightOpacity: 0.6
};

function App() {
  const [inputText, setInputText] = useState('');
  const [selectedFont, setSelectedFont] = useState(defaultStyle.fontFamily);
  const [style, setStyle] = useState<EmojiStyle>(defaultStyle);
  const [selectedPreset, setSelectedPreset] = useState<EmojiPreset | null>(null);
  const { emojis, isGenerating, error, generateFromText, clearEmojis } = useEmojiGenerator();

  const handleFontChange = (fontFamily: string) => {
    setSelectedFont(fontFamily);
    setStyle(prev => ({ ...prev, fontFamily }));
    setSelectedPreset(null);
  };

  const handlePresetSelect = (preset: EmojiPreset) => {
    setSelectedPreset(preset);
    setStyle({ ...preset.style, fontFamily: selectedFont });
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      alert('テキストを入力してください');
      return;
    }

    await generateFromText(inputText, style);
  };

  const handleDownloadAll = async () => {
    try {
      await downloadAllEmojis(emojis);
    } catch (err) {
      alert('ZIP作成中にエラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <DotGrid
        dotSize={24}
        gap={120}
        baseColor="#343434"
        activeColor="#3b82f6"
        proximity={100}
        shockRadius={100}
        shockStrength={10}
        className="fixed inset-0"
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            <SplitText delay={0.1}>絵文字ジェネレーター</SplitText>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg text-gray-300"
          >
            <GlowingText glowColor="#3b82f6">テキストから128x128px</GlowingText>
            の絵文字を簡単に作成
          </motion.p>
        </motion.header>

        <div className="max-w-5xl mx-auto lg:mr-60">
          <FadeInContainer delay={0.2}>
            <TextInput
              value={inputText}
              onTextChange={setInputText}
            />
          </FadeInContainer>

          <FadeInContainer delay={0.3}>
            <FontSelector
              selectedFont={selectedFont}
              onFontChange={handleFontChange}
            />
          </FadeInContainer>

          <FadeInContainer delay={0.4}>
            <EmojiStyleControls
              style={style}
              onStyleChange={setStyle}
              selectedPreset={selectedPreset}
              onPresetSelect={handlePresetSelect}
            />
          </FadeInContainer>
          <FadeInContainer delay={0.6} className="text-center mb-8 mt-8">
            <StarBorder
              as="button"
              color={isGenerating ? "orange" : "blue"}
              speed="3s"
              className="px-8 py-3 mr-4"
              onClick={handleGenerate}
              disabled={isGenerating || !inputText.trim()}
              style={{
                opacity: isGenerating || !inputText.trim() ? 0.6 : 1,
                cursor: isGenerating || !inputText.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? '生成中...' : '✨ 絵文字を生成'}
            </StarBorder>

            {emojis.length > 0 && (
              <AnimatedButton
                onClick={clearEmojis}
                variant="secondary"
                className="ml-4"
              >
                🗑️ クリア
              </AnimatedButton>
            )}
          </FadeInContainer>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/80 backdrop-blur-sm border border-red-700 text-red-300 px-4 py-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}

          <EmojiPreview
            emojis={emojis}
            onDownload={downloadEmoji}
            onDownloadAll={handleDownloadAll}
          />
        </div>

        {/* Fixed Live Preview */}
        <div className="hidden lg:block fixed top-24 right-8 w-56 z-20">
          <FadeInContainer delay={0.3}>
            <LivePreview
              text={inputText}
              style={style}
            />
          </FadeInContainer>
        </div>
      </div>
    </div>
  );
}

export default App;