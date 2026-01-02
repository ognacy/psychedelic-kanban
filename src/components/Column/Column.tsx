import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task as TaskType, TaskStatus } from '../../types';
import { Task } from '../Task/Task';
import './Column.css';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: TaskType[];
  onDeleteTask: (id: string) => void;
  onRenameTask: (id: string, newTitle: string) => void;
}

export function Column({ id, title, tasks, onDeleteTask, onRenameTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`column ${isOver ? 'column--over' : ''}`}>
      <h2 className="column__header">
        {title}
        <span className="column__count"> [{tasks.length}]</span>
      </h2>
      <div ref={setNodeRef} className="column__content">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="column__empty">
              {'~ VOID ~'}
            </div>
          ) : (
            tasks.map((task) => (
              <Task key={task.id} task={task} onDelete={onDeleteTask} onRename={onRenameTask} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
