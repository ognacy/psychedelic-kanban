/**
 * UndoButton Component
 *
 * A fixed-position button for undoing recent actions.
 *
 * Design Choices:
 * - Fixed positioning: Always accessible regardless of scroll position
 * - Visual feedback: Shows available undo count, disables when empty
 * - Prominent styling: Psychedelic effects draw attention to this feature
 * - Semantic HTML: Uses button element with disabled state for accessibility
 */

import './UndoButton.css';

interface UndoButtonProps {
  onUndo: () => void;
  canUndo: boolean;       // Whether there are actions to undo
  historyCount: number;   // Number of available undo operations
}

export function UndoButton({ onUndo, canUndo, historyCount }: UndoButtonProps) {
  return (
    <button
      className={`undo-button ${!canUndo ? 'undo-button--disabled' : ''}`}
      onClick={onUndo}
      disabled={!canUndo}
      /**
       * Title attribute provides tooltip on hover.
       * Different messages for enabled vs disabled states.
       */
      title={canUndo ? `Undo (${historyCount} available)` : 'Nothing to undo'}
    >
      {/* Unicode arrow symbol for visual clarity */}
      <span className="undo-button__icon">↶</span>

      <span className="undo-button__text">UNDO</span>

      {/*
        Only show count badge when there are actions to undo.
        Provides at-a-glance information about undo depth.
      */}
      {canUndo && <span className="undo-button__count">[{historyCount}]</span>}
    </button>
  );
}
