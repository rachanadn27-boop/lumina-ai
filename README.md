# Lumina: Privacy-First Local AI Writing & Coding Assistant

Lumina is a highly advanced, local-first AI writing and programming assistant that works globally across all applications on your desktop. It connects directly to your local Ollama runtime, processing text inputs entirely on your hardware with 100% data privacy (no cloud connections, telemetry, or third-party cookies).

---

## ✨ Features
1. **Context-Aware Smart Actions**: Auto-detects if selected text is source code, email, or markdown, prioritizing matching actions (e.g. "Fix Syntax" or "Generate Unit Test" for code).
2. **Interactive Visual Diff View**: Color-coded, unified diff viewer showing additions (green) and deletions (red).
3. **Refine & Multi-Turn Chat**: Send incremental refinement instructions (*"make it sound more polite"*, *"summarize this in bullet points"*) directly in the popup.
4. **Local Style Guides & RAG Context**: Upload style guides, notes, or project documentation to serve as local references.
5. **Local Semantic History Search**: Search previous writing sessions conceptually using local vector embeddings.
6. **Custom Action Keybindings**: Assign specific key combinations to prompt templates.
7. **Absolute Network Isolation**: Strictly sandbox-configured Electron processes preventing external network queries.

---

## 🛠️ Tech Stack
- **Desktop core**: Electron, TypeScript
- **Frontend renderer**: React, Tailwind CSS, Zustand, Lucide-react
- **Database**: SQLite3 (with automatic JSON file fallback if native binaries aren't installed)
- **Local AI Engine**: Ollama (`qwen3:8b`, `llama3:8b`, `gemma3:12b`, `nomic-embed-text`)
- **Testing**: Vitest, Playwright
- **Packaging**: Electron Builder
- **Website**: Next.js (App Router), Tailwind CSS

---

## 📂 Project Directory Structure

```text
lumina/
├── README.md
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── app/                  # Electron + React Application
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main/         # Main Electron code & DB/AI services
│   │   └── renderer/     # React GUI components & Zustand store
│   └── tests/            # Vitest & Playwright test suites
└── website/              # Next.js Marketing Web App
    ├── package.json
    └── src/app/          # Next.js app routes (Home, Docs, Blog, Privacy, Contact)
```

---

## 🚀 Getting Started

### Prerequisites
1. Download and run **Ollama** from [ollama.com](https://ollama.com).
2. Install **Node.js** (version 20 recommended).

### Running the Desktop App in Development Mode
```bash
# Navigate to app directory
cd app

# Install dependencies
npm install

# Run the Electron development server
npm run dev
```

### Building Desktop Installers
```bash
# From app/ directory, compile the binaries for Windows, macOS, or Linux
npm run build
```
Compiled installers will output to the `app/release/` directory.

### Running the Marketing Website
```bash
# Navigate to website directory
cd ../website

# Install dependencies
npm install

# Run next.js dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the marketing site.

---

## ⌨️ Default Keyboard Shortcuts
- **Trigger Overlay**: Highlight text in any application and press `Ctrl+Shift+E`.
- **Improve Writing**: `Ctrl+Shift+I`
- **Fix Grammar**: `Ctrl+Shift+G`
- **Summarize Text**: `Ctrl+Shift+S`
