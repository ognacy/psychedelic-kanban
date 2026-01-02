import './UndoButton.css';

interface UndoButtonProps {
  onUndo: () => void;
  canUndo: boolean;
  historyCount: number;
}

export function UndoButton({ onUndo, canUndo, historyCount }: UndoButtonProps) {
  return (
    <button
      className={`undo-button ${!canUndo ? 'undo-button--disabled' : ''}`}
      onClick={onUndo}
      disabled={!canUndo}
      title={canUndo ? `Undo (${historyCount} available)` : 'Nothing to undo'}
    >
      <span className="undo-button__icon">↶</span>
      <span className="undo-button__text">UNDO</span>
      {canUndo && <span className="undo-button__count">[{historyCount}]</span>}
    </button>
  );
}
