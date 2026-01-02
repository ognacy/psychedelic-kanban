import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task as TaskType } from '../../types';
import './Task.css';

interface TaskProps {
  task: TaskType;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  isOverlay?: boolean;
}

export function Task({ task, onDelete, onRename, isOverlay = false }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleBlur = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onRename(task.id, editTitle.trim());
    }
    setIsEditing(false);
    setEditTitle(task.title);
  };

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
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
    >
      {isEditing ? (
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
        <span
          className="task__title"
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          {task.title}
        </span>
      )}
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
