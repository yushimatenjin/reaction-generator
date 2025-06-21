# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Run all tests:
```bash
npm test
```

Run specific test file:
```bash
npm test src/csvParser.test.ts
```

Type checking:
```bash
npm run typecheck
```

Linting:
```bash
npm run lint
```

## Architecture Overview

This is a Discord/Slack emoji generator web application built with TypeScript, Vite, and Canvas API. The application follows a modular architecture with strict error handling using the neverthrow library.

### Core Components

**EmojiGeneratorApp (main.ts)**: Main application class that orchestrates all functionality. Handles DOM interactions, user input, and coordinates between different modules.

**Input Processing Pipeline**:
- `csvParser.ts`: Parses CSV files into EmojiData objects
- `textParser.ts`: Parses manual text input (supports both plain text and comma-separated format)
- Both parsers output the same `EmojiData` interface for unified processing

**Font Management (fontLoader.ts)**: Dynamically loads Google Fonts and manages font availability.

**Image Generation (emojiGenerator.ts)**: Uses Canvas API to generate emoji images with:
- Automatic font size adjustment to fit content within 128x128px canvas
- Multi-line text support with word wrapping
- Configurable styling (font, colors, size)

**Download System (downloadManager.ts)**: Handles both individual PNG downloads and bulk ZIP downloads using JSZip.

### Data Flow

1. **Input**: Users can either type text manually in textarea OR upload CSV files (CSV content is appended to textarea)
2. **Parsing**: TextArea content is parsed by `textParser.ts` into `EmojiData[]`
3. **Generation**: Each EmojiData is converted to a canvas image with auto-sizing
4. **Output**: Generated images are displayed in preview area and available for download

### Key Design Patterns

**Unified Input Hub**: All input (manual + CSV) flows through a single textarea, eliminating input source complexity.

**Result-based Error Handling**: All functions that can fail return `Result<T, E>` from neverthrow instead of throwing exceptions.

**Auto-scaling Text Rendering**: Complex canvas rendering logic automatically adjusts font size and handles multi-line text to ensure content always fits within the emoji canvas bounds.

## Coding Rules

- File naming convention: `src/<lowerCamelCase>.ts`
- Add tests in `src/*.test.ts` for `src/*.ts` or in `test/*.test.ts`
- Use functions and function scope instead of classes (except for main app class)
- Add `.ts` extension to imports for deno compatibility. Example: `import {} from "./x.ts"`
- Do not disable any lint rules without explicit user approval
- Export a function that matches the filename, and keep everything else as private as possible

## Design Policy

This project follows a no-exceptions design policy:

- Do not throw exceptions in application code
- Use Result types for error handling instead of throwing
- Prefer explicit error handling over implicit exception propagation
- Choose between neverthrow library or custom Result type implementation
- All functions that can fail should return Result<T, E> instead of throwing

## Input Format

Text input supports two formats:
- Simple text: One emoji text per line (e.g., "草")
- Named format: "name,text" per line (e.g., "grass,草")

Constraints:
- Maximum 50 lines
- Text limited to 20 characters
- Names limited to 32 characters