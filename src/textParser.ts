import { Result, ok, err } from 'neverthrow'
import { EmojiData } from './csvParser.ts'

export function parseTextInput(textContent: string): Result<EmojiData[], string> {
  try {
    const lines = textContent.trim().split('\n')
    
    if (lines.length === 0 || (lines.length === 1 && !lines[0].trim())) {
      return err('テキストが入力されていません')
    }

    if (lines.length > 50) {
      return err('テキストは最大50行までです')
    }

    const emojiData: EmojiData[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      if (line.includes(',')) {
        const parts = line.split(',', 2)
        const text = parts[0].trim().replace(/"/g, '')
        const filename = parts[1].trim().replace(/"/g, '')

        if (!text || !filename) {
          return err(`行 ${i + 1}: 表示テキストとファイル名は空にできません`)
        }

        if (text.length > 20) {
          return err(`行 ${i + 1}: 表示テキストは20文字以内にしてください`)
        }

        if (filename.length > 32) {
          return err(`行 ${i + 1}: ファイル名は32文字以内にしてください`)
        }

        const name = text.length > 10 ? text.substring(0, 10) + '...' : text
        emojiData.push({ name, text, filename })
      } else {
        const text = line.trim()
        
        if (text.length > 20) {
          return err(`行 ${i + 1}: 文字は20文字以内にしてください`)
        }

        const name = text.length > 10 ? text.substring(0, 10) + '...' : text
        const filename = text.toLowerCase().replace(/[^a-z0-9]/g, '')
        const finalFilename = filename || `emoji${i + 1}`
        
        emojiData.push({ name, text, filename: finalFilename })
      }
    }

    if (emojiData.length === 0) {
      return err('有効なデータが見つかりませんでした')
    }

    return ok(emojiData)
  } catch (error) {
    return err(`テキストの解析中にエラーが発生しました: ${error}`)
  }
}

export default parseTextInput