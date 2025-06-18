PromptParto is a lightweight web tool for breaking long prompts into manageable parts. It supports multiple split strategies, dark mode, AI-assisted refinement and undo/redo history.

## Features

- **Flexible splitting** - choose automatic splitting, by paragraph or line, a custom delimiter or a regular expression.
- **Dark mode toggle** - switch themes with a single click or `Ctrl+D`.
- **AI refine** - refine any prompt part using Gemini AI directly from the interface.
- **Undo/redo** - revert changes with `Ctrl+Z` and `Ctrl+Y`.
- Drag & drop text files, automatic saving, and export to text, Markdown or JSON.

## Running locally

Simply open `index.html` in your browser. The page loads TailwindCSS and other assets from public CDNs, so an internet connection is required on first load. You can also host the project on GitHub Pages.

## Example prompt

A sample prompt is provided in `prompts/example.json`. Use the **Load Example** button (`Alt+L`) to insert it into the editor.

## Stored data

PromptParto saves your settings, saved prompts and history in your browser's `localStorage`. Use the export buttons to back up your data or the import option to restore it. You can also export individual parts or the entire prompt in text, Markdown or JSON format.

## Keyboard shortcuts

- `Ctrl+Z` / `Ctrl+Y` – Undo/Redo.
- `Ctrl+D` – Toggle dark mode.
- `Ctrl+S` – Save current prompt.
- `Alt+L` – Load example prompt.
- `Ctrl+E` – Export as text.
- `Ctrl+M` – Export as Markdown.
- `Ctrl+J` – Export as JSON.
- `Ctrl+Shift+C` – Clear all.
- `Ctrl+O` – Clear output only.
- `Ctrl+H` – Show history.
- `Ctrl+T` – Show templates.