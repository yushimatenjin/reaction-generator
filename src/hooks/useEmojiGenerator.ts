import { useState, useCallback } from 'react';
import { EmojiStyle, GeneratedEmoji } from '../types.ts';
import { parseTextInput } from '../textParser.ts';
import { generateEmojis } from '../emojiGenerator.ts';

export function useEmojiGenerator() {
  const [emojis, setEmojis] = useState<GeneratedEmoji[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFromText = useCallback(async (text: string, style: EmojiStyle) => {
    setIsGenerating(true);
    setError(null);

    try {
      const parseResult = parseTextInput(text);
      if (parseResult.isErr()) {
        setError(parseResult.error);
        return;
      }

      const generationResult = await generateEmojis(parseResult.value, style);
      if (generationResult.isErr()) {
        setError(generationResult.error);
        return;
      }

      setEmojis(generationResult.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearEmojis = useCallback(() => {
    setEmojis([]);
    setError(null);
  }, []);

  return {
    emojis,
    isGenerating,
    error,
    generateFromText,
    clearEmojis
  };
}