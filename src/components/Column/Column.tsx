/**
 * Column Component
 *
 * A droppable container for tasks within a specific status category.
 *
 * Design Choices:
 * - useDroppable: Makes the column a valid drop target for tasks
 * - SortableContext: Enables reordering within the column
 * - verticalListSortingStrategy: Optimized for vertical drag-and-drop lists
 * - Visual feedback on hover: isOver state triggers CSS for drop indication
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task as TaskType, TaskStatus } from '../../types';
import { Task } from '../Task/Task';
import './Column.css';

interface ColumnProps {
  id: TaskStatus;         // Column identifier (matches task.status)
  title: string;          // Display title for the column header
  tasks: TaskType[];      // Tasks filtered to this column's status
  onDeleteTask: (id: string) => void;
  onRenameTask: (id: string, newTitle: string) => void;
}

export function Column({ id, title, tasks, onDeleteTask, onRenameTask }: ColumnProps) {
  /**
   * useDroppable makes this column a valid drop target.
   * - setNodeRef: Attach to the droppable container element
   * - isOver: True when a draggable is hovering over this column
   *
   * The `id` passed to useDroppable must match what we check in Board's
   * handleDragOver to identify column drops vs task drops.
   */
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`column ${isOver ? 'column--over' : ''}`}>
      {/*
        Column header with task count.
        Count updates automatically as tasks are added/removed.
      */}
      <h2 className="column__header">
        {title}
        <span className="column__count"> [{tasks.length}]</span>
      </h2>

      {/*
        Droppable content area.
        setNodeRef must be on the actual drop target element.
      */}
      <div ref={setNodeRef} className="column__content">
        {/*
          SortableContext enables drag-to-reorder within this column.
          - items: Array of unique IDs for sortable items
          - strategy: Algorithm for calculating drop positions

          Design Choice: verticalListSortingStrategy assumes items stack
          vertically and calculates drop index based on Y position. This
          matches our CSS column layout.
        */}
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            /**
             * Empty state message.
             * Styled to be visible but unobtrusive.
             */
            <div className="column__empty">
              {'~ VOID ~'}
            </div>
          ) : (
            /**
             * Render task cards.
             * Key must match the id used in SortableContext items.
             */
            tasks.map((task) => (
              <Task key={task.id} task={task} onDelete={onDeleteTask} onRename={onRenameTask} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
