/**
 * Task Component
 *
 * A draggable task card with inline editing support.
 *
 * Design Choices:
 * - useSortable hook: Combines draggable + droppable behavior for list reordering
 * - Inline editing via double-click: More intuitive than edit buttons, saves space
 * - Edit mode disables drag: Prevents accidental drags while typing
 * - CSS transforms for drag: Hardware-accelerated, smooth 60fps animations
 */

import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task as TaskType } from '../../types';
import './Task.css';

interface TaskProps {
  task: TaskType;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  isOverlay?: boolean; // True when rendered in DragOverlay
}

export function Task({ task, onDelete, onRename, isOverlay = false }: TaskProps) {
  /**
   * Edit mode state - controls whether we show input or text.
   */
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * useSortable provides everything needed for drag-and-drop:
   * - setNodeRef: Attach to the DOM element
   * - attributes: ARIA attributes for accessibility
   * - listeners: Mouse/touch/keyboard event handlers
   * - transform: Current drag position offset
   * - transition: CSS transition for animations
   * - isDragging: True while this item is being dragged
   */
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  /**
   * Apply transform as inline style for smooth drag animation.
   * CSS.Transform.toString converts the transform object to a CSS string.
   */
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Dim the original while dragging
  };

  /**
   * Auto-focus and select input text when entering edit mode.
   * This provides immediate typing capability without extra clicks.
   */
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  /**
   * Enter edit mode on double-click.
   * stopPropagation prevents the click from triggering drag.
   */
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(task.title);
  };

  /**
   * Save changes when input loses focus.
   * Only calls onRename if the title actually changed.
   */
  const handleBlur = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onRename(task.id, editTitle.trim());
    }
    setIsEditing(false);
    setEditTitle(task.title);
  };

  /**
   * Keyboard shortcuts for edit mode:
   * - Enter: Save and exit
   * - Escape: Cancel and exit (restore original title)
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task ${isDragging ? 'task--dragging' : ''} ${isOverlay ? 'task--overlay' : ''} ${isEditing ? 'task--editing' : ''}`}
      /**
       * Conditionally spread drag attributes/listeners.
       * When editing, we disable drag to allow text selection and cursor movement.
       */
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
    >
      {isEditing ? (
        /**
         * Edit mode: Show input field.
         * Uses same styling as task title for visual consistency.
         */
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="task__edit-input"
        />
      ) : (
        /**
         * Display mode: Show task title with double-click handler.
         * Title attribute provides hint about edit functionality.
         */
        <span
          className="task__title"
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          {task.title}
        </span>
      )}

      {/*
        Delete button always visible.
        stopPropagation prevents delete click from triggering drag.
      */}
      <button
        className="task__delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        aria-label="Delete task"
      >
        [X]
      </button>
    </div>
  );
}
