import { Result, ok, err } from 'neverthrow'

export interface EmojiData {
  name: string
  text: string
  filename: string
}

export function parseCsv(csvContent: string): Result<EmojiData[], string> {
  try {
    const trimmedContent = csvContent.trim()
    if (!trimmedContent) {
      return err('CSVファイルが空です')
    }
    
    const lines = trimmedContent.split('\n')
    
    if (lines.length === 0) {
      return err('CSVファイルが空です')
    }

    if (lines.length > 50) {
      return err('CSVファイルは最大50行までです')
    }

    const emojiData: EmojiData[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const parts = line.split(',')
      if (parts.length < 2) {
        return err(`行 ${i + 1}: 表示テキストとファイル名の両方が必要です`)
      }

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
    }

    if (emojiData.length === 0) {
      return err('有効なデータが見つかりませんでした')
    }

    return ok(emojiData)
  } catch (error) {
    return err(`CSVの解析中にエラーが発生しました: ${error}`)
  }
}

export default parseCsv