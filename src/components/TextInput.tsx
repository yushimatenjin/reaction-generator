import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { parseCsv } from '../csvParser.ts';

interface TextInputProps {
  onTextChange: (text: string) => void;
  value: string;
}

export function TextInput({ onTextChange, value }: TextInputProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('CSVファイルのみアップロード可能です');
      return;
    }

    try {
      const text = await file.text();
      const result = parseCsv(text);
      
      if (result.isErr()) {
        alert(`CSVファイルの読み込みエラー: ${result.error}`);
        return;
      }

      const csvText = result.value
        .map(emoji => `${emoji.text},${emoji.filename}`)
        .join('\n');
      
      onTextChange(value ? `${value}\n${csvText}` : csvText);
    } catch (error) {
      alert('ファイルの読み込み中にエラーが発生しました');
    }
  }, [value, onTextChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || file.name.endsWith('.csv')
    );
    
    if (csvFile) {
      handleFileUpload(csvFile);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 border border-gray-700"
    >
      <h3 className="text-lg font-semibold mb-4 text-white">テキスト入力</h3>
      
      <div className="mb-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-900/30'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <p className="text-gray-300 mb-2">CSVファイルをドラッグ&ドロップ</p>
          <label className="inline-block px-4 py-2 bg-gray-700 text-gray-200 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
            ファイルを選択
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          絵文字テキスト (最大50行)
        </label>
        <textarea
          value={value}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="草&#10;やばい,yabai&#10;すごい&#10;最高&#10;ありがとう"
          rows={8}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder-gray-400"
        />
        <p className="text-xs text-gray-400 mt-2">
          形式: 「テキスト」または「テキスト,ファイル名」(1行ずつ)
        </p>
      </div>
    </motion.div>
  );
}