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
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTask = (id: string): TaskType | undefined => {
    return tasks.find((t) => t.id === id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = findTask(String(event.active.id));
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTask = findTask(activeId);
    if (!activeTask) return;

    // Check if dropping over a column
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        moveTask(activeId, newStatus);
      }
      return;
    }

    // Check if dropping over another task
    const overTask = findTask(overId);
    if (overTask && activeTask.status !== overTask.status) {
      moveTask(activeId, overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeTask = findTask(activeId);
    const overTask = findTask(overId);

    if (!activeTask) return;

    // Reorder within the same column
    if (overTask && activeTask.status === overTask.status) {
      const columnTasks = getTasksByStatus(activeTask.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
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
      <TaskForm onAdd={addTask} />

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

        <DragOverlay>
          {activeTask ? (
            <Task task={activeTask} onDelete={() => {}} onRename={() => {}} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Weather />

      <UndoButton onUndo={undo} canUndo={canUndo} historyCount={historyCount} />
    </div>
  );
}
