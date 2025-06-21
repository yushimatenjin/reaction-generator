import { Result, ok, err } from 'neverthrow'

interface FontConfig {
  name: string
  url: string
}

const GOOGLE_FONTS: FontConfig[] = [
  { name: 'Noto Sans JP', url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap' },
  { name: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' },
  { name: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap' },
  { name: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
  { name: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap' },
  { name: 'Poppins', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap' },
  { name: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap' }
]

const loadedFonts = new Set<string>()

function loadFont(fontConfig: FontConfig): Promise<Result<void, string>> {
  return new Promise((resolve) => {
    if (loadedFonts.has(fontConfig.name)) {
      resolve(ok(undefined))
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontConfig.url

    const timeout = setTimeout(() => {
      document.head.removeChild(link)
      resolve(err(`フォント ${fontConfig.name} の読み込みがタイムアウトしました`))
    }, 10000)

    link.onload = () => {
      clearTimeout(timeout)
      loadedFonts.add(fontConfig.name)
      resolve(ok(undefined))
    }

    link.onerror = () => {
      clearTimeout(timeout)
      document.head.removeChild(link)
      resolve(err(`フォント ${fontConfig.name} の読み込みに失敗しました`))
    }

    document.head.appendChild(link)
  })
}

export async function loadGoogleFont(fontName: string): Promise<Result<void, string>> {
  const fontConfig = GOOGLE_FONTS.find(f => f.name === fontName)
  if (!fontConfig) {
    return err(`未対応のフォントです: ${fontName}`)
  }

  return await loadFont(fontConfig)
}

export function getAvailableFonts(): string[] {
  return GOOGLE_FONTS.map(f => f.name)
}

export default loadGoogleFont