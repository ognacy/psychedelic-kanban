# Psychedelic Kanban

A trippy, fractal-inspired kanban todo app that looks like it's straight out of an LSD fever dream. Drag and drop your tasks through the cosmic void while rainbow gradients pulse and swirl around you.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## Features

- **Drag & Drop Kanban Board** - Move tasks between TODO, IN PROGRESS, and DONE columns
- **Psychedelic UI** - Fractal patterns, rainbow animations, kaleidoscope borders, floating orbs
- **Persistent Storage** - All tasks saved to localStorage
- **Undo System** - Undo up to 25 operations (persists across sessions)
- **Inline Editing** - Double-click any task to rename it
- **Weather Widget** - Shows current weather based on your location
- **Fully Responsive** - Works on desktop and mobile

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **dnd-kit** - Drag and drop functionality
- **Open-Meteo API** - Weather data (no API key required)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ognacy/psychedelic-kanban.git
   cd psychedelic-kanban
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

| Action | How |
|--------|-----|
| Add a task | Type in the input field and click [CREATE] or press Enter |
| Move a task | Drag and drop between columns |
| Edit a task | Double-click on the task text |
| Delete a task | Click [X] on the task |
| Undo | Click the UNDO button in the bottom-right corner |

## Project Structure

```
src/
├── components/
│   ├── Board/          # Main kanban board with drag-and-drop context
│   ├── Column/         # Individual column (TODO/IN PROGRESS/DONE)
│   ├── Task/           # Draggable task card with edit functionality
│   ├── TaskForm/       # Input form for creating new tasks
│   ├── CRTEffect/      # Psychedelic visual effects wrapper
│   ├── UndoButton/     # Floating undo button
│   └── Weather/        # Weather widget component
├── hooks/
│   ├── useKanban.ts    # Task state management with undo history
│   └── useLocalStorage.ts  # localStorage persistence hook
├── styles/
│   ├── variables.css   # CSS custom properties (colors, spacing)
│   ├── crt-effects.css # Animations and psychedelic effects
│   └── global.css      # Base styles and resets
└── types/
    └── index.ts        # TypeScript type definitions
```

## License

MIT
