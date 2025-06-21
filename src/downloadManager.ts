import { Result, ok, err } from 'neverthrow'
import { GeneratedEmoji } from './emojiGenerator.ts'

declare const JSZip: any

function loadJSZip(): Promise<Result<void, string>> {
  return new Promise((resolve) => {
    if (typeof JSZip !== 'undefined') {
      resolve(ok(undefined))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    
    script.onload = () => {
      resolve(ok(undefined))
    }
    
    script.onerror = () => {
      resolve(err('JSZipライブラリの読み込みに失敗しました'))
    }
    
    document.head.appendChild(script)
  })
}

export function downloadSingleEmoji(emoji: GeneratedEmoji): Result<void, string> {
  try {
    const url = URL.createObjectURL(emoji.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${emoji.filename}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return ok(undefined)
  } catch (error) {
    return err(`ダウンロード中にエラーが発生しました: ${error}`)
  }
}

export async function downloadMultipleEmojis(emojis: GeneratedEmoji[]): Promise<Result<void, string>> {
  const loadResult = await loadJSZip()
  if (loadResult.isErr()) {
    return err(loadResult.error)
  }

  try {
    const zip = new JSZip()
    
    for (const emoji of emojis) {
      const arrayBuffer = await emoji.blob.arrayBuffer()
      zip.file(`${emoji.filename}.png`, arrayBuffer)
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'discord-emojis.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return ok(undefined)
  } catch (error) {
    return err(`一括ダウンロード中にエラーが発生しました: ${error}`)
  }
}

export default downloadMultipleEmojis