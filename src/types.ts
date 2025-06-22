export interface EmojiData {
  name: string
  text: string
  filename: string
}

export interface EmojiStyle {
  fontFamily: string
  fontWeight: string
  fontStyle: string
  fontSize: number
  backgroundColor: string
  backgroundOpacity: number
  textColor: string
  shape: 'square' | 'circle'
  layout: 'auto' | 'single' | 'horizontal' | 'vertical' | 'grid'
  padding: number
  borderWidth: number
  borderColor: string
  shadowEnabled: boolean
  shadowColor: string
  shadowBlur: number
  highlightEnabled: boolean
  highlightColor: string
  highlightSize: number
  highlightOpacity: number
}

export interface GeneratedEmoji {
  name: string
  filename: string
  canvas: HTMLCanvasElement
  blob: Blob
}

export interface EmojiPreset {
  id: string
  name: string
  description: string
  style: EmojiStyle
}

export const DEFAULT_PRESETS: EmojiPreset[] = [
  {
    id: 'default',
    name: 'デフォルト',
    description: 'シンプルな基本スタイル',
    style: {
      fontFamily: 'Noto Sans JP',
      fontWeight: '500',
      fontStyle: 'normal',
      fontSize: 48,
      backgroundColor: '#ffffff',
      backgroundOpacity: 1,
      textColor: '#000000',
      shape: 'circle',
      layout: 'auto',
      padding: 8,
      borderWidth: 0,
      borderColor: '#000000',
      shadowEnabled: true,
      shadowColor: '#000000',
      shadowBlur: 4,
      highlightEnabled: false,
      highlightColor: '#ffffff',
      highlightSize: 0.3,
      highlightOpacity: 0.6
    }
  },
  {
    id: 'neon-glow',
    name: 'ネオングロー',
    description: 'サイバーパンクスタイルの光るエフェクト',
    style: {
      fontFamily: 'Orbitron',
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontSize: 48,
      backgroundColor: '#0a0a0a',
      backgroundOpacity: 1,
      textColor: '#00ffff',
      shape: 'square',
      layout: 'auto',
      padding: 8,
      borderWidth: 2,
      borderColor: '#00ffff',
      shadowEnabled: true,
      shadowColor: '#00ffff',
      shadowBlur: 15,
      highlightEnabled: true,
      highlightColor: '#ffffff',
      highlightSize: 0.4,
      highlightOpacity: 0.8
    }
  },
  {
    id: 'kawaii-pink',
    name: 'かわいいピンク',
    description: 'ふんわり可愛いパステルピンク',
    style: {
      fontFamily: 'Comfortaa',
      fontWeight: '600',
      fontStyle: 'normal',
      fontSize: 44,
      backgroundColor: '#ffb3d9',
      backgroundOpacity: 1,
      textColor: '#ffffff',
      shape: 'circle',
      layout: 'auto',
      padding: 12,
      borderWidth: 3,
      borderColor: '#ff80cc',
      shadowEnabled: true,
      shadowColor: '#ff99d6',
      shadowBlur: 8,
      highlightEnabled: true,
      highlightColor: '#ffffff',
      highlightSize: 0.5,
      highlightOpacity: 0.7
    }
  },
  {
    id: 'retro-gaming',
    name: 'レトロゲーミング',
    description: '8ビットゲーム風のピクセルスタイル',
    style: {
      fontFamily: 'Fredoka One',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontSize: 42,
      backgroundColor: '#2d1b69',
      backgroundOpacity: 1,
      textColor: '#ffd700',
      shape: 'square',
      layout: 'auto',
      padding: 6,
      borderWidth: 4,
      borderColor: '#8b5cf6',
      shadowEnabled: false,
      shadowColor: '#000000',
      shadowBlur: 0,
      highlightEnabled: false,
      highlightColor: '#ffffff',
      highlightSize: 0.3,
      highlightOpacity: 0.6
    }
  },
  {
    id: 'minimalist',
    name: 'ミニマリスト',
    description: 'シンプルで洗練されたデザイン',
    style: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontStyle: 'normal',
      fontSize: 46,
      backgroundColor: '#ffffff',
      backgroundOpacity: 1,
      textColor: '#1f2937',
      shape: 'square',
      layout: 'auto',
      padding: 10,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadowEnabled: true,
      shadowColor: '#6b7280',
      shadowBlur: 4,
      highlightEnabled: false,
      highlightColor: '#ffffff',
      highlightSize: 0.2,
      highlightOpacity: 0.4
    }
  },
  {
    id: 'gradient-sunset',
    name: 'サンセットグラデーション',
    description: '夕焼けのような美しいグラデーション',
    style: {
      fontFamily: 'Poppins',
      fontWeight: '700',
      fontStyle: 'normal',
      fontSize: 45,
      backgroundColor: '#ff6b6b',
      backgroundOpacity: 1,
      textColor: '#ffffff',
      shape: 'circle',
      layout: 'auto',
      padding: 8,
      borderWidth: 0,
      borderColor: '#ffffff',
      shadowEnabled: true,
      shadowColor: '#ff9999',
      shadowBlur: 12,
      highlightEnabled: true,
      highlightColor: '#ffffff',
      highlightSize: 0.4,
      highlightOpacity: 0.6
    }
  },
  {
    id: 'dark-mode',
    name: 'ダークモード',
    description: 'モダンなダークテーマ',
    style: {
      fontFamily: 'Roboto',
      fontWeight: '600',
      fontStyle: 'normal',
      fontSize: 44,
      backgroundColor: '#1f2937',
      backgroundOpacity: 1,
      textColor: '#f9fafb',
      shape: 'square',
      layout: 'auto',
      padding: 10,
      borderWidth: 1,
      borderColor: '#374151',
      shadowEnabled: true,
      shadowColor: '#000000',
      shadowBlur: 6,
      highlightEnabled: false,
      highlightColor: '#ffffff',
      highlightSize: 0.3,
      highlightOpacity: 0.5
    }
  }
]