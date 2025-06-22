import { motion } from 'framer-motion';
import { EmojiStyle, EmojiPreset } from '../types.ts';
import { PresetSelector } from './PresetSelector.tsx';
import { StyleSection, StyleControl, StyleSelect, StyleSlider, StyleColor, StyleToggle } from './StyleControl.tsx';

interface EmojiStyleControlsProps {
  style: EmojiStyle;
  onStyleChange: (style: EmojiStyle) => void;
  selectedPreset: EmojiPreset | null;
  onPresetSelect: (preset: EmojiPreset) => void;
}

export function EmojiStyleControls({ style, onStyleChange, selectedPreset, onPresetSelect }: EmojiStyleControlsProps) {
  const updateStyle = (updates: Partial<EmojiStyle>) => {
    onStyleChange({ ...style, ...updates });
  };

  return (
    <>
      <PresetSelector
        selectedPreset={selectedPreset}
        onPresetSelect={onPresetSelect}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-6 text-white">スタイル設定</h3>
        
        <div className="space-y-6">

          <StyleSection title="フォント設定" icon="🔤">
            <div className="grid grid-cols-2 gap-4">
              <StyleControl label="フォントウェイト">
                <StyleSelect
                  value={style.fontWeight}
                  onChange={(value) => updateStyle({ fontWeight: value })}
                  options={[
                    { value: '300', label: '300 - Light' },
                    { value: '400', label: '400 - Regular' },
                    { value: '500', label: '500 - Medium' },
                    { value: '700', label: '700 - Bold' },
                    { value: '900', label: '900 - Black' }
                  ]}
                />
              </StyleControl>
              
              <StyleControl label="フォントスタイル">
                <StyleSelect
                  value={style.fontStyle}
                  onChange={(value) => updateStyle({ fontStyle: value })}
                  options={[
                    { value: 'normal', label: '🔤 Normal' },
                    { value: 'italic', label: '🎭 Italic' }
                  ]}
                />
              </StyleControl>
            </div>
            
            <StyleControl label="フォントサイズ" value={style.fontSize} unit="px">
              <StyleSlider
                value={style.fontSize}
                onChange={(value) => updateStyle({ fontSize: value })}
                min={12}
                max={120}
              />
            </StyleControl>
          </StyleSection>


          <StyleSection title="色・透明度" icon="🎨">
            <div className="grid grid-cols-2 gap-4">
              <StyleControl label="背景色">
                <StyleColor
                  value={style.backgroundColor}
                  onChange={(value) => updateStyle({ backgroundColor: value })}
                />
              </StyleControl>
              
              <StyleControl label="文字色">
                <StyleColor
                  value={style.textColor}
                  onChange={(value) => updateStyle({ textColor: value })}
                />
              </StyleControl>
            </div>
            
            <StyleControl label="背景透明度" value={Math.round(style.backgroundOpacity * 100)} unit="%">
              <StyleSlider
                value={style.backgroundOpacity}
                onChange={(value) => updateStyle({ backgroundOpacity: value })}
                min={0}
                max={1}
                step={0.01}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>透明</span>
                <span>不透明</span>
              </div>
            </StyleControl>
          </StyleSection>

          <StyleSection title="形状・レイアウト" icon="📐">
            <div className="grid grid-cols-2 gap-4">
              <StyleControl label="形状">
                <StyleSelect
                  value={style.shape}
                  onChange={(value) => updateStyle({ shape: value as 'square' | 'circle' })}
                  options={[
                    { value: 'circle', label: '🔵 丸型' },
                    { value: 'square', label: '⬜ 角丸四角' }
                  ]}
                />
              </StyleControl>
              
              <StyleControl label="レイアウト">
                <StyleSelect
                  value={style.layout}
                  onChange={(value) => updateStyle({ layout: value as any })}
                  options={[
                    { value: 'auto', label: '🤖 自動' },
                    { value: 'single', label: '1️⃣ 単体' },
                    { value: 'horizontal', label: '➡️ 横並び' },
                    { value: 'vertical', label: '⬇️ 縦並び' },
                    { value: 'grid', label: '🔲 グリッド' }
                  ]}
                />
              </StyleControl>
            </div>
          </StyleSection>

          <StyleSection title="余白・ボーダー" icon="📏">
            <div className="grid grid-cols-2 gap-4">
              <StyleControl label="パディング" value={style.padding} unit="px">
                <StyleSlider
                  value={style.padding}
                  onChange={(value) => updateStyle({ padding: value })}
                  min={0}
                  max={30}
                />
              </StyleControl>
              
              <StyleControl label="ボーダー幅" value={style.borderWidth} unit="px">
                <StyleSlider
                  value={style.borderWidth}
                  onChange={(value) => updateStyle({ borderWidth: value })}
                  min={0}
                  max={8}
                />
              </StyleControl>
            </div>
            
            <StyleControl label="ボーダー色">
              <StyleColor
                value={style.borderColor}
                onChange={(value) => updateStyle({ borderColor: value })}
              />
            </StyleControl>
          </StyleSection>

          <StyleSection title="シャドウ効果" icon="🌫️">
            <StyleToggle
              checked={style.shadowEnabled}
              onChange={(checked) => updateStyle({ shadowEnabled: checked })}
              label="🌫️ シャドウ有効"
              id="shadowEnabled"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <StyleControl label="シャドウ色">
                <StyleColor
                  value={style.shadowColor}
                  onChange={(value) => updateStyle({ shadowColor: value })}
                  disabled={!style.shadowEnabled}
                />
              </StyleControl>
              
              <StyleControl label="シャドウぼかし" value={style.shadowBlur} unit="px">
                <StyleSlider
                  value={style.shadowBlur}
                  onChange={(value) => updateStyle({ shadowBlur: value })}
                  min={0}
                  max={20}
                  disabled={!style.shadowEnabled}
                />
              </StyleControl>
            </div>
          </StyleSection>

          <StyleSection title="ハイライト効果" icon="✨">
            <StyleToggle
              checked={style.highlightEnabled}
              onChange={(checked) => updateStyle({ highlightEnabled: checked })}
              label="✨ テカリ・ハイライト"
              id="highlightEnabled"
            />
            
            <StyleControl label="ハイライト色">
              <StyleColor
                value={style.highlightColor}
                onChange={(value) => updateStyle({ highlightColor: value })}
                disabled={!style.highlightEnabled}
              />
            </StyleControl>
            
            <div className="grid grid-cols-2 gap-4">
              <StyleControl label="ハイライトサイズ" value={Math.round(style.highlightSize * 100)} unit="%">
                <StyleSlider
                  value={style.highlightSize}
                  onChange={(value) => updateStyle({ highlightSize: value })}
                  min={0.1}
                  max={0.8}
                  step={0.1}
                  disabled={!style.highlightEnabled}
                />
              </StyleControl>
              
              <StyleControl label="ハイライト透明度" value={Math.round(style.highlightOpacity * 100)} unit="%">
                <StyleSlider
                  value={style.highlightOpacity}
                  onChange={(value) => updateStyle({ highlightOpacity: value })}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  disabled={!style.highlightEnabled}
                />
              </StyleControl>
            </div>
          </StyleSection>
        </div>
      </motion.div>
    </>
  );
}