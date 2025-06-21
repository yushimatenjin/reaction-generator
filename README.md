# Discord/Slack 絵文字作成ツール

DiscordやSlackで使える絵文字を簡単に作成できるウェブアプリケーションです。

## 機能

- CSVファイルから最大50個の絵文字を一括生成
- Google Fontsからフォントを選択可能
- フォントサイズ、背景色、文字色をカスタマイズ
- 個別ダウンロードまたは一括ダウンロード（ZIP形式）

## 使い方

1. CSVファイルを準備します（形式: `名前,文字`）
   ```csv
   すごい,すごい
   やったね,やったね
   ありがとう,ありがとう
   ```

2. ファイルをアップロードし、スタイルを設定します

3. 「絵文字生成」ボタンをクリックして絵文字を生成します

4. 生成された絵文字は個別または一括でダウンロードできます

## 技術仕様

- TypeScript + Viteで構築
- Canvas APIを使用した画像生成
- Google Fonts APIを使用したフォント読み込み
- neverthrowライブラリを使用したエラーハンドリング

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test

# 型チェック
npm run typecheck

# リント
npm run lint
```

## CSVファイル形式

- 各行に「名前,文字」の形式で記述
- 名前は32文字以内
- 文字は20文字以内
- 最大50行まで

## サポートフォント

- Noto Sans JP
- Roboto
- Open Sans
- Lato
- Montserrat
- Poppins
- Inter