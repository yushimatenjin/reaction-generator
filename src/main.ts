import parseCsv, { EmojiData } from './csvParser.ts'
import parseTextInput from './textParser.ts'
import loadGoogleFont from './fontLoader.ts'
import generateEmojis, { EmojiStyle, GeneratedEmoji } from './emojiGenerator.ts'
import { downloadSingleEmoji, downloadMultipleEmojis } from './downloadManager.ts'

class EmojiGeneratorApp {
  private generatedEmojis: GeneratedEmoji[] = []
  
  private manualInput: HTMLTextAreaElement
  private csvFileInput: HTMLInputElement
  private fontSelect: HTMLSelectElement
  private fontSizeSlider: HTMLInputElement
  private fontSizeValue: HTMLSpanElement
  private bgColorInput: HTMLInputElement
  private textColorInput: HTMLInputElement
  private generateBtn: HTMLButtonElement
  private downloadBtn: HTMLButtonElement
  private previewArea: HTMLDivElement
  private csvError: HTMLDivElement

  constructor() {
    this.manualInput = document.getElementById('manualInput') as HTMLTextAreaElement
    this.csvFileInput = document.getElementById('csvFile') as HTMLInputElement
    this.fontSelect = document.getElementById('fontSelect') as HTMLSelectElement
    this.fontSizeSlider = document.getElementById('fontSize') as HTMLInputElement
    this.fontSizeValue = document.getElementById('fontSizeValue') as HTMLSpanElement
    this.bgColorInput = document.getElementById('bgColor') as HTMLInputElement
    this.textColorInput = document.getElementById('textColor') as HTMLInputElement
    this.generateBtn = document.getElementById('generateBtn') as HTMLButtonElement
    this.downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement
    this.previewArea = document.getElementById('previewArea') as HTMLDivElement
    this.csvError = document.getElementById('csvError') as HTMLDivElement

    this.initializeEventListeners()
    this.checkInputContent()
  }

  private initializeEventListeners(): void {
    this.manualInput.addEventListener('input', this.checkInputContent.bind(this))
    this.csvFileInput.addEventListener('change', this.handleCsvUpload.bind(this))
    this.fontSizeSlider.addEventListener('input', this.updateFontSizeDisplay.bind(this))
    this.generateBtn.addEventListener('click', this.handleGenerate.bind(this))
    this.downloadBtn.addEventListener('click', this.handleDownloadAll.bind(this))
  }

  private checkInputContent(): void {
    const hasText = this.manualInput.value.trim().length > 0
    this.generateBtn.disabled = !hasText
  }

  private updateFontSizeDisplay(): void {
    this.fontSizeValue.textContent = `${this.fontSizeSlider.value}px`
  }

  private async handleCsvUpload(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (!file) {
      this.csvError.textContent = ''
      return
    }

    try {
      const content = await this.readFileAsText(file)
      const result = parseCsv(content)
      
      if (result.isErr()) {
        this.csvError.textContent = result.error
        this.csvError.style.color = '#e74c3c'
        return
      }

      const csvLines = result.value.map(item => `${item.text},${item.filename}`)
      
      const currentText = this.manualInput.value.trim()
      const newText = currentText 
        ? `${currentText}\n${csvLines.join('\n')}`
        : csvLines.join('\n')
      
      this.manualInput.value = newText
      this.csvError.textContent = `${result.value.length}個のアイテムをテキストエリアに追加しました`
      this.csvError.style.color = '#27ae60'
      
      this.checkInputContent()
      
      target.value = ''
    } catch (error) {
      this.csvError.textContent = 'ファイルの読み込みに失敗しました'
      this.csvError.style.color = '#e74c3c'
    }
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file, 'UTF-8')
    })
  }

  private async handleGenerate(): Promise<void> {
    const textContent = this.manualInput.value.trim()
    if (!textContent) return

    this.generateBtn.disabled = true
    this.generateBtn.textContent = '生成中...'

    const parseResult = parseTextInput(textContent)
    if (parseResult.isErr()) {
      this.showError(parseResult.error)
      this.generateBtn.disabled = false
      this.generateBtn.textContent = '絵文字生成'
      return
    }

    const selectedFont = this.fontSelect.value

    const fontLoadResult = await loadGoogleFont(selectedFont)
    if (fontLoadResult.isErr()) {
      this.showError(fontLoadResult.error)
      this.generateBtn.disabled = false
      this.generateBtn.textContent = '絵文字生成'
      return
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    const style: EmojiStyle = {
      fontFamily: selectedFont,
      fontSize: parseInt(this.fontSizeSlider.value),
      backgroundColor: this.bgColorInput.value,
      textColor: this.textColorInput.value
    }

    const result = await generateEmojis(parseResult.value, style)
    
    if (result.isErr()) {
      this.showError(result.error)
    } else {
      this.generatedEmojis = result.value
      this.displayEmojis(this.generatedEmojis)
      this.downloadBtn.disabled = false
      this.csvError.textContent = `${this.generatedEmojis.length}個の絵文字を生成しました！`
      this.csvError.style.color = '#27ae60'
    }

    this.generateBtn.disabled = false
    this.generateBtn.textContent = '絵文字生成'
  }

  private displayEmojis(emojis: GeneratedEmoji[]): void {
    this.previewArea.innerHTML = ''
    
    emojis.forEach(emoji => {
      const container = document.createElement('div')
      container.className = 'emoji-preview'
      
      const canvas = emoji.canvas
      const name = document.createElement('div')
      name.className = 'emoji-name'
      name.textContent = emoji.name
      
      const downloadSingle = document.createElement('button')
      downloadSingle.textContent = 'DL'
      downloadSingle.style.fontSize = '12px'
      downloadSingle.style.padding = '4px 8px'
      downloadSingle.onclick = () => {
        const result = downloadSingleEmoji(emoji)
        if (result.isErr()) {
          this.showError(result.error)
        }
      }
      
      container.appendChild(canvas)
      container.appendChild(name)
      container.appendChild(downloadSingle)
      this.previewArea.appendChild(container)
    })
  }

  private async handleDownloadAll(): Promise<void> {
    if (this.generatedEmojis.length === 0) return

    this.downloadBtn.disabled = true
    this.downloadBtn.textContent = 'ダウンロード中...'

    const result = await downloadMultipleEmojis(this.generatedEmojis)
    
    if (result.isErr()) {
      this.showError(result.error)
    }

    this.downloadBtn.disabled = false
    this.downloadBtn.textContent = '一括ダウンロード'
  }

  private showError(message: string): void {
    this.csvError.textContent = message
    this.csvError.style.color = '#e74c3c'
  }
}

function main(): void {
  document.addEventListener('DOMContentLoaded', () => {
    new EmojiGeneratorApp()
  })
}

main()

export default main