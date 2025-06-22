import { GeneratedEmoji } from '../types.ts';

export function downloadEmoji(emoji: GeneratedEmoji): void {
  const url = URL.createObjectURL(emoji.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${emoji.filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllEmojis(emojis: GeneratedEmoji[]): Promise<void> {
  // Dynamic import to avoid bundling JSZip if not needed
  const { default: JSZip } = await import('jszip');
  
  const zip = new JSZip();
  
  emojis.forEach(emoji => {
    zip.file(`${emoji.filename}.png`, emoji.blob);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'discord-emojis.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}