/**
 * Type Definitions for Psychedelic Kanban
 *
 * Design Choice: Using TypeScript's union types for TaskStatus ensures
 * compile-time safety when moving tasks between columns. The string literal
 * union prevents typos and provides autocomplete support.
 */

/**
 * Task status represents the three kanban columns.
 * Using string literals instead of an enum for better JSON serialization
 * compatibility with localStorage.
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * Core task entity.
 *
 * Design Choices:
 * - `id`: Using crypto.randomUUID() for guaranteed uniqueness without a server
 * - `createdAt`: Timestamp enables future sorting features without schema changes
 * - Flat structure: No nested objects keeps localStorage serialization simple
 */
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
}

/**
 * Column metadata for rendering the board.
 * Separated from Task to follow single responsibility principle.
 */
export interface Column {
  id: TaskStatus;
  title: string;
}

/**
 * Static column configuration.
 *
 * Design Choice: Defined as a constant array rather than derived from TaskStatus
 * to control display order and allow custom display titles that differ from
 * the internal status values (e.g., "IN PROGRESS" vs "in-progress").
 */
export const COLUMNS: Column[] = [
  { id: 'todo', title: 'TODO' },
  { id: 'in-progress', title: 'IN PROGRESS' },
  { id: 'done', title: 'DONE' },
];
