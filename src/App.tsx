/**
 * App Component
 *
 * Root component that composes the application structure.
 *
 * Design Choices:
 * - CRTEffect wrapper: Applies visual effects to entire app
 * - Single Board component: All kanban logic contained within
 * - Global CSS import: Styles loaded at app root for consistency
 * - No routing: Single-page app with all content visible
 */

import { CRTEffect } from './components/CRTEffect/CRTEffect';
import { Board } from './components/Board/Board';
import './styles/global.css';

function App() {
  return (
    /**
     * CRTEffect wraps all content to apply psychedelic visual effects.
     * The Board component handles all kanban functionality.
     */
    <CRTEffect>
      <Board />
    </CRTEffect>
  );
}

export default App;
