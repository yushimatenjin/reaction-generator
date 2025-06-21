import { describe, it, expect } from 'vitest'
import parseTextInput from './textParser.ts'

describe('parseTextInput', () => {
  it('should parse simple text lines', () => {
    const textContent = '草\nやったね\nお疲れ様'
    const result = parseTextInput(textContent)
    
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toHaveLength(3)
      expect(result.value[0]).toEqual({ name: '草', text: '草', filename: 'emoji1' })
      expect(result.value[1]).toEqual({ name: 'やったね', text: 'やったね', filename: 'emoji2' })
      expect(result.value[2]).toEqual({ name: 'お疲れ様', text: 'お疲れ様', filename: 'emoji3' })
    }
  })

  it('should parse comma-separated text and filename', () => {
    const textContent = '草,kusa\nやったね,yattane\nお疲れ様,otsukaresama'
    const result = parseTextInput(textContent)
    
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toHaveLength(3)
      expect(result.value[0]).toEqual({ name: '草', text: '草', filename: 'kusa' })
      expect(result.value[1]).toEqual({ name: 'やったね', text: 'やったね', filename: 'yattane' })
      expect(result.value[2]).toEqual({ name: 'お疲れ様', text: 'お疲れ様', filename: 'otsukaresama' })
    }
  })

  it('should handle mixed format', () => {
    const textContent = '草\nやったね,yattane\nお疲れ様'
    const result = parseTextInput(textContent)
    
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toHaveLength(3)
      expect(result.value[0]).toEqual({ name: '草', text: '草', filename: 'emoji1' })
      expect(result.value[1]).toEqual({ name: 'やったね', text: 'やったね', filename: 'yattane' })
      expect(result.value[2]).toEqual({ name: 'お疲れ様', text: 'お疲れ様', filename: 'emoji3' })
    }
  })

  it('should truncate long names', () => {
    const longText = 'これはとても長いテキストです'
    const textContent = longText
    const result = parseTextInput(textContent)
    
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value[0].name).toBe('これはとても長いテキ...')
      expect(result.value[0].text).toBe(longText)
      expect(result.value[0].filename).toBe('emoji1')
    }
  })

  it('should reject empty input', () => {
    const result = parseTextInput('')
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('テキストが入力されていません')
    }
  })

  it('should reject text longer than 20 characters', () => {
    const longText = 'a'.repeat(21)
    const result = parseTextInput(longText)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('行 1: 文字は20文字以内にしてください')
    }
  })

  it('should skip empty lines', () => {
    const textContent = '草\n\nやったね\n\nお疲れ様'
    const result = parseTextInput(textContent)
    
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toHaveLength(3)
    }
  })

  it('should reject filename longer than 32 characters', () => {
    const longFilename = 'a'.repeat(33)
    const textContent = `text,${longFilename}`
    const result = parseTextInput(textContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('行 1: ファイル名は32文字以内にしてください')
    }
  })
})