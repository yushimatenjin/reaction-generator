import { Result, ok, err } from 'neverthrow'
import { EmojiData } from './csvParser.ts'
import { EmojiStyle, GeneratedEmoji } from './types.ts'

function getOptimalLayout(text: string, layout: string) {
  const chars = text.split('')
  const charCount = chars.length

  if (layout !== 'auto') {
    return { layout, chars }
  }

  // 自動レイアウト判定
  if (charCount === 1) {
    return { layout: 'single', chars }
  } else if (charCount === 2) {
    return { layout: 'horizontal', chars } // 1x2 (50% 50%)
  } else if (charCount === 3) {
    return { layout: 'vertical', chars } // 縦に3文字
  } else if (charCount === 4) {
    return { layout: 'grid', chars } // 2x2
  } else if (charCount <= 6) {
    return { layout: 'grid', chars } // 2x3 または 3x2
  } else {
    return { layout: 'single', chars: [text] } // 長文は1行で
  }
}

function createCanvas(text: string, style: EmojiStyle): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = 128
  canvas.height = 128

  // 背景とシェイプの描画
  ctx.save()

  if (style.shadowEnabled) {
    ctx.shadowColor = style.shadowColor
    ctx.shadowBlur = style.shadowBlur
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
  }

  // 背景色に透明度を適用
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const backgroundColorWithOpacity = hexToRgba(style.backgroundColor, style.backgroundOpacity)

  if (style.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.width - style.padding * 2) / 2, 0, Math.PI * 2)
    ctx.fillStyle = backgroundColorWithOpacity
    ctx.fill()

    if (style.borderWidth > 0) {
      ctx.strokeStyle = style.borderColor
      ctx.lineWidth = style.borderWidth
      ctx.stroke()
    }

    // マスク用のクリッピング
    ctx.clip()
  } else {
    const radius = 8
    const x = style.padding
    const y = style.padding
    const width = canvas.width - style.padding * 2
    const height = canvas.height - style.padding * 2

    ctx.beginPath()
    ctx.roundRect(x, y, width, height, radius)
    ctx.fillStyle = backgroundColorWithOpacity
    ctx.fill()

    if (style.borderWidth > 0) {
      ctx.strokeStyle = style.borderColor
      ctx.lineWidth = style.borderWidth
      ctx.stroke()
    }
  }

  ctx.restore()

  const { layout, chars } = getOptimalLayout(text, style.layout)
  const effectiveArea = canvas.width - (style.padding * 2)

  ctx.fillStyle = style.textColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  let fontSize = style.fontSize

  // ハイライト描画関数
  const drawHighlight = (text: string, x: number, y: number, currentFontSize: number) => {
    if (!style.highlightEnabled) return

    ctx.save()

    // ハイライト用のグラデーション作成
    const textMetrics = ctx.measureText(text)
    const highlightHeight = currentFontSize * style.highlightSize
    const highlightY = y - currentFontSize * 0.3

    const gradient = ctx.createLinearGradient(
      x - textMetrics.width / 2,
      highlightY,
      x + textMetrics.width / 2,
      highlightY + highlightHeight
    )

    gradient.addColorStop(0, style.highlightColor + Math.round(255 * style.highlightOpacity).toString(16).padStart(2, '0'))
    gradient.addColorStop(0.5, style.highlightColor + Math.round(255 * style.highlightOpacity * 0.8).toString(16).padStart(2, '0'))
    gradient.addColorStop(1, style.highlightColor + '00')

    // ハイライトの形状を描画
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.ellipse(x, highlightY + highlightHeight / 2, textMetrics.width / 2.2, highlightHeight / 2, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  // テキスト描画関数（ハイライト対応）
  const drawTextWithHighlight = (text: string, x: number, y: number, currentFontSize: number) => {
    // まずハイライトを描画
    drawHighlight(text, x, y, currentFontSize)
    // その後にテキストを描画
    ctx.fillText(text, x, y)
  }

  switch (layout) {
    case 'single':
      // 1文字または長文を中央に - パツパツに詰める
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`
      let textMetrics = ctx.measureText(text)

      // より詰めて大きく表示（95%まで使用）
      while ((textMetrics.width > effectiveArea * 0.95 || fontSize > effectiveArea * 0.85) && fontSize > 8) {
        fontSize -= 1
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`
        textMetrics = ctx.measureText(text)
      }

      drawTextWithHighlight(text, canvas.width / 2, canvas.height / 2, fontSize)
      break

    case 'horizontal':
      // 2文字を左右に配置 (50% 50%) - パツパツに詰める
      let maxWidth = effectiveArea * 0.48 // 各文字が48%のスペースを使用
      fontSize = Math.min(fontSize, effectiveArea * 0.5) // より大きく開始
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`

      // 各文字が収まるまでサイズ調整
      while (fontSize > 8) {
        const char1Metrics = ctx.measureText(chars[0])
        const char2Metrics = chars[1] ? ctx.measureText(chars[1]) : { width: 0 }

        if (char1Metrics.width <= maxWidth && char2Metrics.width <= maxWidth) {
          break
        }
        fontSize -= 1
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`
      }

      const leftX = canvas.width * 0.26  // より中央寄り
      const rightX = canvas.width * 0.74 // より中央寄り
      const centerY = canvas.height / 2

      drawTextWithHighlight(chars[0], leftX, centerY, fontSize)
      if (chars[1]) drawTextWithHighlight(chars[1], rightX, centerY, fontSize)
      break

    case 'vertical':
      // 3文字を縦に配置 - パツパツに詰める
      const verticalSpace = effectiveArea * 0.95 / chars.length
      fontSize = Math.min(fontSize, verticalSpace * 0.9) // より大きく
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`

      // 文字幅チェック
      while (fontSize > 8) {
        const maxCharWidth = Math.max(...chars.map(char => ctx.measureText(char).width))
        if (maxCharWidth <= effectiveArea * 0.9) break
        fontSize -= 1
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`
      }

      const centerX = canvas.width / 2
      const totalHeight = (chars.length - 1) * fontSize * 1.1 // より詰める
      const startY = canvas.height / 2 - totalHeight / 2

      chars.forEach((char, index) => {
        const y = startY + (index * fontSize * 1.1)
        drawTextWithHighlight(char, centerX, y, fontSize)
      })
      break

    case 'grid':
      // 2x2 または 2x3 グリッド配置 - パツパツに詰める
      const cols = chars.length === 4 ? 2 : Math.min(3, Math.ceil(chars.length / 2))
      const rows = Math.ceil(chars.length / cols)

      // セルサイズをより大きく使用
      const cellWidth = effectiveArea * 0.95 / cols
      const cellHeight = effectiveArea * 0.95 / rows
      const maxCellSize = Math.min(cellWidth, cellHeight)

      fontSize = Math.min(fontSize, maxCellSize * 0.8) // より大きく開始
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`

      // 各文字がセル内に収まるまでサイズ調整
      while (fontSize > 8) {
        const maxCharWidth = Math.max(...chars.map(char => ctx.measureText(char).width))
        if (maxCharWidth <= cellWidth * 0.9 && fontSize <= cellHeight * 0.9) {
          break
        }
        fontSize -= 1
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px "${style.fontFamily}"`
      }

      // グリッドをより中央に詰めて配置
      const gridWidth = cellWidth * cols
      const gridHeight = cellHeight * rows
      const gridStartX = (canvas.width - gridWidth) / 2 + cellWidth / 2
      const gridStartY = (canvas.height - gridHeight) / 2 + cellHeight / 2

      chars.forEach((char, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        const x = gridStartX + col * cellWidth
        const y = gridStartY + row * cellHeight
        drawTextWithHighlight(char, x, y, fontSize)
      })
      break
  }

  return canvas
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Result<Blob, string>> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(ok(blob))
      } else {
        resolve(err('画像の生成に失敗しました'))
      }
    }, 'image/png')
  })
}

export async function generateEmoji(
  emojiData: EmojiData,
  style: EmojiStyle
): Promise<Result<GeneratedEmoji, string>> {
  try {
    const canvas = createCanvas(emojiData.text, style)
    const blobResult = await canvasToBlob(canvas)

    return blobResult.map((blob: Blob) => ({
      name: emojiData.name,
      filename: emojiData.filename,
      canvas,
      blob
    }))
  } catch (error) {
    return err(`絵文字生成中にエラーが発生しました: ${error}`)
  }
}

export async function generateEmojis(
  emojiDataList: EmojiData[],
  style: EmojiStyle
): Promise<Result<GeneratedEmoji[], string>> {
  const results: GeneratedEmoji[] = []

  for (const emojiData of emojiDataList) {
    const result = await generateEmoji(emojiData, style)
    if (result.isErr()) {
      return err(result.error)
    }
    results.push(result.value)
  }

  return ok(results)
}

export default generateEmojis