import { Result, ok, err } from 'neverthrow'
import { EmojiData } from './csvParser.ts'

export interface EmojiStyle {
  fontFamily: string
  fontSize: number
  backgroundColor: string
  textColor: string
}

export interface GeneratedEmoji {
  name: string
  filename: string
  canvas: HTMLCanvasElement
  blob: Blob
}

function createCanvas(text: string, style: EmojiStyle): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  canvas.width = 128
  canvas.height = 128

  ctx.fillStyle = style.backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const padding = 10
  const maxWidth = canvas.width - (padding * 2)
  const maxHeight = canvas.height - (padding * 2)

  let fontSize = style.fontSize
  ctx.font = `${fontSize}px "${style.fontFamily}"`
  
  let textMetrics = ctx.measureText(text)
  let textWidth = textMetrics.width
  let textHeight = fontSize

  while ((textWidth > maxWidth || textHeight > maxHeight) && fontSize > 8) {
    fontSize -= 2
    ctx.font = `${fontSize}px "${style.fontFamily}"`
    textMetrics = ctx.measureText(text)
    textWidth = textMetrics.width
    textHeight = fontSize
  }

  if (text.includes('\n') || text.length > 10) {
    const words = text.split(/[\s\n]/)
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testMetrics = ctx.measureText(testLine)
      
      if (testMetrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }

    const lineHeight = fontSize * 1.2
    const totalHeight = lines.length * lineHeight
    
    if (totalHeight > maxHeight) {
      const scaleFactor = maxHeight / totalHeight
      fontSize *= scaleFactor
      ctx.font = `${fontSize}px "${style.fontFamily}"`
    }

    const startY = (canvas.height - (lines.length - 1) * lineHeight) / 2
    
    ctx.fillStyle = style.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight)
      ctx.fillText(line, canvas.width / 2, y)
    })
  } else {
    ctx.fillStyle = style.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
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
    
    return blobResult.map(blob => ({
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