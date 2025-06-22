import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EmojiStyle } from '../types.ts';

interface LivePreviewProps {
  text: string;
  style: EmojiStyle;
}

export function LivePreview({ text, style }: LivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewText, setPreviewText] = useState('');

  useEffect(() => {
    const lines = text.trim().split('\n');
    const firstLine = lines[0]?.trim();
    if (firstLine) {
      // コンマで分割されている場合、最初の部分を取得
      const textPart = firstLine.includes(',') ? firstLine.split(',')[0] : firstLine;
      setPreviewText(textPart || '絵');
    } else {
      setPreviewText('絵');
    }
  }, [text]);

  useEffect(() => {
    if (!canvasRef.current || !previewText) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    canvas.width = 128;
    canvas.height = 128;

    // 絵文字生成ロジックのコピー（簡略版）
    ctx.save();

    if (style.shadowEnabled) {
      ctx.shadowColor = style.shadowColor;
      ctx.shadowBlur = style.shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    // 背景色に透明度を適用
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const backgroundColorWithOpacity = hexToRgba(style.backgroundColor, style.backgroundOpacity);

    if (style.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.width - style.padding * 2) / 2, 0, Math.PI * 2);
      ctx.fillStyle = backgroundColorWithOpacity;
      ctx.fill();

      if (style.borderWidth > 0) {
        ctx.strokeStyle = style.borderColor;
        ctx.lineWidth = style.borderWidth;
        ctx.stroke();
      }

      ctx.clip();
    } else {
      const radius = 8;
      const x = style.padding;
      const y = style.padding;
      const width = canvas.width - style.padding * 2;
      const height = canvas.height - style.padding * 2;

      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.fillStyle = backgroundColorWithOpacity;
      ctx.fill();

      if (style.borderWidth > 0) {
        ctx.strokeStyle = style.borderColor;
        ctx.lineWidth = style.borderWidth;
        ctx.stroke();
      }
    }

    ctx.restore();

    // テキスト描画
    const chars = previewText.split('');
    const charCount = chars.length;
    const effectiveArea = canvas.width - (style.padding * 2);

    ctx.fillStyle = style.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let fontSize = style.fontSize;
    let layout = style.layout;

    // ハイライト描画関数
    const drawHighlight = (text: string, x: number, y: number, currentFontSize: number) => {
      if (!style.highlightEnabled) return;

      ctx.save();

      const textMetrics = ctx.measureText(text);
      const highlightHeight = currentFontSize * style.highlightSize;
      const highlightY = y - currentFontSize * 0.3;

      const gradient = ctx.createLinearGradient(
        x - textMetrics.width / 2,
        highlightY,
        x + textMetrics.width / 2,
        highlightY + highlightHeight
      );

      gradient.addColorStop(0, style.highlightColor + Math.round(255 * style.highlightOpacity).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.5, style.highlightColor + Math.round(255 * style.highlightOpacity * 0.8).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, style.highlightColor + '00');

      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, highlightY + highlightHeight / 2, textMetrics.width / 2.2, highlightHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawTextWithHighlight = (text: string, x: number, y: number, currentFontSize: number) => {
      drawHighlight(text, x, y, currentFontSize);
      ctx.fillText(text, x, y);
    };

    // 自動レイアウト判定
    if (layout === 'auto') {
      if (charCount === 1) layout = 'single';
      else if (charCount === 2) layout = 'horizontal';
      else if (charCount === 3) layout = 'vertical';
      else if (charCount === 4) layout = 'grid';
      else layout = 'grid';
    }

    switch (layout) {
      case 'single':
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;
        let textMetrics = ctx.measureText(previewText);

        // より詰めて大きく表示（95%まで使用）
        while ((textMetrics.width > effectiveArea * 0.95 || fontSize > effectiveArea * 0.85) && fontSize > 8) {
          fontSize -= 1;
          ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;
          textMetrics = ctx.measureText(previewText);
        }

        drawTextWithHighlight(previewText, canvas.width / 2, canvas.height / 2, fontSize);
        break;

      case 'horizontal':
        let maxWidth = effectiveArea * 0.48;
        fontSize = Math.min(fontSize, effectiveArea * 0.5);
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;

        while (fontSize > 8) {
          const char1Metrics = ctx.measureText(chars[0]);
          const char2Metrics = chars[1] ? ctx.measureText(chars[1]) : { width: 0 };

          if (char1Metrics.width <= maxWidth && char2Metrics.width <= maxWidth) {
            break;
          }
          fontSize -= 1;
          ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;
        }

        const leftX = canvas.width * 0.26;
        const rightX = canvas.width * 0.74;
        const centerY = canvas.height / 2;

        drawTextWithHighlight(chars[0], leftX, centerY, fontSize);
        if (chars[1]) drawTextWithHighlight(chars[1], rightX, centerY, fontSize);
        break;

      case 'vertical':
        const verticalSpace = effectiveArea * 0.95 / chars.length;
        fontSize = Math.min(fontSize, verticalSpace * 0.9);
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;

        while (fontSize > 8) {
          const maxCharWidth = Math.max(...chars.map(char => ctx.measureText(char).width));
          if (maxCharWidth <= effectiveArea * 0.9) break;
          fontSize -= 1;
          ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;
        }

        const centerX = canvas.width / 2;
        const totalHeight = (chars.length - 1) * fontSize * 1.1;
        const verticalStartY = canvas.height / 2 - totalHeight / 2;

        chars.forEach((char, index) => {
          const y = verticalStartY + (index * fontSize * 1.1);
          drawTextWithHighlight(char, centerX, y, fontSize);
        });
        break;

      case 'grid':
        const cols = chars.length === 4 ? 2 : Math.min(3, Math.ceil(chars.length / 2));
        const rows = Math.ceil(chars.length / cols);

        const cellWidth = effectiveArea * 0.95 / cols;
        const cellHeight = effectiveArea * 0.95 / rows;
        const maxCellSize = Math.min(cellWidth, cellHeight);

        fontSize = Math.min(fontSize, maxCellSize * 0.8);
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;

        while (fontSize > 8) {
          const maxCharWidth = Math.max(...chars.map(char => ctx.measureText(char).width));
          if (maxCharWidth <= cellWidth * 0.9 && fontSize <= cellHeight * 0.9) {
            break;
          }
          fontSize -= 1;
          ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`;
        }

        const gridWidth = cellWidth * cols;
        const gridHeight = cellHeight * rows;
        const gridStartX = (canvas.width - gridWidth) / 2 + cellWidth / 2;
        const gridStartY = (canvas.height - gridHeight) / 2 + cellHeight / 2;

        chars.forEach((char, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = gridStartX + col * cellWidth;
          const y = gridStartY + row * cellHeight;
          drawTextWithHighlight(char, x, y, fontSize);
        });
        break;
    }
  }, [previewText, style]);

  if (!previewText.trim()) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-700"
    >
      <h4 className="text-sm font-medium text-gray-300 mb-3 text-center">
        ライブプレビュー
      </h4>
      <div className="flex justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={128}
            height={128}
            className="border border-gray-600 rounded-lg"
            style={{ width: '128px', height: '128px' }}
          />
          <div className="text-xs text-gray-400 text-center mt-2">
            {previewText} ({previewText.length}文字)
          </div>
        </div>
      </div>
    </motion.div>
  );
}