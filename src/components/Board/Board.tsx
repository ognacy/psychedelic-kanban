/**
 * Board Component
 *
 * The main orchestrator for the kanban board, handling all drag-and-drop logic.
 *
 * Design Choices:
 * - Uses dnd-kit over react-beautiful-dnd: dnd-kit is actively maintained and
 *   offers better customization for animations (important for psychedelic effects)
 * - DndContext at board level: Enables cross-column dragging with a single context
 * - DragOverlay for drag preview: Provides smooth visual feedback separate from
 *   the actual DOM position, allowing custom styling during drag
 */

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task as TaskType, TaskStatus, COLUMNS } from '../../types';
import { useKanban } from '../../hooks/useKanban';
import { Column } from '../Column/Column';
import { Task } from '../Task/Task';
import { TaskForm } from '../TaskForm/TaskForm';
import { Weather } from '../Weather/Weather';
import { UndoButton } from '../UndoButton/UndoButton';
import './Board.css';

export function Board() {
  const { tasks, addTask, deleteTask, moveTask, renameTask, reorderTasks, undo, canUndo, historyCount, getTasksByStatus } =
    useKanban();

  /**
   * Track the currently dragged task for the DragOverlay.
   * Null when not dragging.
   */
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  /**
   * Configure drag sensors.
   *
   * Design Choices:
   * - PointerSensor with distance constraint: Prevents accidental drags when
   *   clicking. 8px threshold allows for minor mouse movement during clicks.
   * - KeyboardSensor: Accessibility support for keyboard-only navigation
   * - sortableKeyboardCoordinates: Standard arrow key behavior for lists
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Find a task by ID from the flat task array.
   * Used during drag events to get task details.
   */
  const findTask = (id: string): TaskType | undefined => {
    return tasks.find((t) => t.id === id);
  };

  /**
   * Called when drag starts - store the active task for overlay rendering.
   */
  const handleDragStart = (event: DragStartEvent) => {
    const task = findTask(String(event.active.id));
    if (task) {
      setActiveTask(task);
    }
  };

  /**
   * Called continuously during drag when hovering over droppable areas.
   *
   * Design Choice: Move task immediately on drag over (not just on drop).
   * This provides visual feedback showing where the task will land,
   * making the interaction feel more responsive and intuitive.
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTask = findTask(activeId);
    if (!activeTask) return;

    // Check if hovering over a column (empty area)
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        moveTask(activeId, newStatus);
      }
      return;
    }

    // Check if hovering over another task - inherit that task's column
    const overTask = findTask(overId);
    if (overTask && activeTask.status !== overTask.status) {
      moveTask(activeId, overTask.status);
    }
  };

  /**
   * Called when drag ends - handle reordering within the same column.
   *
   * Design Choice: Cross-column moves are handled in dragOver for immediate
   * feedback. dragEnd only handles same-column reordering where we need
   * the final drop position.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null); // Clear overlay

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return; // Dropped on self, no change

    const activeTask = findTask(activeId);
    const overTask = findTask(overId);

    if (!activeTask) return;

    // Reorder within the same column using array splice
    if (overTask && activeTask.status === overTask.status) {
      const columnTasks = getTasksByStatus(activeTask.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Preserve tasks from other columns, reorder only this column
        const otherTasks = tasks.filter((t) => t.status !== activeTask.status);
        const reorderedColumnTasks = [...columnTasks];
        const [movedTask] = reorderedColumnTasks.splice(oldIndex, 1);
        reorderedColumnTasks.splice(newIndex, 0, movedTask);
        reorderTasks([...otherTasks, ...reorderedColumnTasks]);
      }
    }
  };

  return (
    <div className="board">
      {/* Task input form at top for easy access */}
      <TaskForm onAdd={addTask} />

      {/*
        DndContext wraps all draggable/droppable elements.
        closestCorners collision detection works well for grid/column layouts.
      */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board__columns">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onDeleteTask={deleteTask}
              onRenameTask={renameTask}
            />
          ))}
        </div>

        {/*
          DragOverlay renders outside the normal flow, following the cursor.
          This allows the dragged item to float above everything with custom
          styling (the trippy glow effect during drag).
        */}
        <DragOverlay>
          {activeTask ? (
            <Task task={activeTask} onDelete={() => {}} onRename={() => {}} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Weather widget shows current conditions based on geolocation */}
      <Weather />

      {/* Fixed-position undo button in bottom-right corner */}
      <UndoButton onUndo={undo} canUndo={canUndo} historyCount={historyCount} />
    </div>
  );
}
