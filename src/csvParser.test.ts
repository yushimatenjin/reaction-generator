import { describe, it, expect } from 'vitest'
import parseCsv from './csvParser.ts'

describe('parseCsv', () => {
  it('should parse valid CSV data', () => {
    const csvContent = 'すごい,sugoi\nやったね,yattane\nありがとう,arigatou'
    const result = parseCsv(csvContent)
    
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toHaveLength(3)
      expect(result.value[0]).toEqual({ name: 'すごい', text: 'すごい', filename: 'sugoi' })
      expect(result.value[1]).toEqual({ name: 'やったね', text: 'やったね', filename: 'yattane' })
      expect(result.value[2]).toEqual({ name: 'ありがとう', text: 'ありがとう', filename: 'arigatou' })
    }
  })

  it('should handle quoted CSV fields', () => {
    const csvContent = '"hello world","helloworld"\n"good job","goodjob"'
    const result = parseCsv(csvContent)
    
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toHaveLength(2)
      expect(result.value[0]).toEqual({ name: 'hello worl...', text: 'hello world', filename: 'helloworld' })
      expect(result.value[1]).toEqual({ name: 'good job', text: 'good job', filename: 'goodjob' })
    }
  })

  it('should reject empty CSV', () => {
    const csvContent = ''
    const result = parseCsv(csvContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('CSVファイルが空です')
    }
  })

  it('should reject CSV with only whitespace', () => {
    const csvContent = '   \n\n   '
    const result = parseCsv(csvContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('CSVファイルが空です')
    }
  })

  it('should reject CSV with more than 50 lines', () => {
    const lines = Array.from({ length: 51 }, (_, i) => `text${i},filename${i}`)
    const csvContent = lines.join('\n')
    const result = parseCsv(csvContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('CSVファイルは最大50行までです')
    }
  })

  it('should reject lines with insufficient data', () => {
    const csvContent = 'text1\ntext2,filename2'
    const result = parseCsv(csvContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('行 1: 表示テキストとファイル名の両方が必要です')
    }
  })

  it('should reject empty text or filename', () => {
    const csvContent = ',filename1\ntext2,'
    const result = parseCsv(csvContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('行 1: 表示テキストとファイル名は空にできません')
    }
  })

  it('should reject filenames longer than 32 characters', () => {
    const longFilename = 'a'.repeat(33)
    const csvContent = `text,${longFilename}`
    const result = parseCsv(csvContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('行 1: ファイル名は32文字以内にしてください')
    }
  })

  it('should reject text longer than 20 characters', () => {
    const longText = 'a'.repeat(21)
    const csvContent = `${longText},filename`
    const result = parseCsv(csvContent)
    
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBe('行 1: 表示テキストは20文字以内にしてください')
    }
  })
})