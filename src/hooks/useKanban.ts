/**
 * useKanban Hook
 *
 * Central state management for the kanban board with full undo support.
 *
 * Design Choices:
 * - Single source of truth: All task state flows through this hook
 * - Undo via state snapshots: Simpler than command pattern, trades memory for simplicity
 * - Separate storage keys: Tasks and history can be cleared independently
 * - Functional updates: All mutations use prev => newState pattern for consistency
 */

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task, TaskStatus } from '../types';

const STORAGE_KEY = 'retro-kanban-tasks';
const HISTORY_KEY = 'retro-kanban-history';

/**
 * Maximum undo operations to retain.
 *
 * Design Choice: 25 is a balance between usability and localStorage limits.
 * Each snapshot stores the full task array, so this caps memory usage while
 * providing ample undo depth for typical usage.
 */
const MAX_HISTORY = 25;

export function useKanban() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);
  const [history, setHistory] = useLocalStorage<Task[][]>(HISTORY_KEY, []);

  /**
   * Save current state to history before making changes.
   *
   * Design Choice: Storing full snapshots rather than diffs because:
   * 1. Simpler implementation with no edge cases
   * 2. Task arrays are small (typically < 100 items)
   * 3. Undo always restores exact previous state
   */
  const saveToHistory = useCallback((currentTasks: Task[]) => {
    setHistory(prev => {
      const newHistory = [...prev, currentTasks];
      // Trim oldest entries when exceeding limit
      if (newHistory.length > MAX_HISTORY) {
        return newHistory.slice(-MAX_HISTORY);
      }
      return newHistory;
    });
  }, [setHistory]);

  /**
   * Add a new task to the TODO column.
   *
   * Design Choice: New tasks always start in TODO. This follows standard
   * kanban methodology where work items enter from the left.
   */
  const addTask = useCallback((title: string) => {
    setTasks(prev => {
      saveToHistory(prev);
      const newTask: Task = {
        id: crypto.randomUUID(), // Browser-native UUID generation
        title: title.trim(),
        status: 'todo',
        createdAt: Date.now(),
      };
      return [...prev, newTask];
    });
  }, [setTasks, saveToHistory]);

  /**
   * Remove a task from the board.
   * Filtered removal preserves array order of remaining tasks.
   */
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      saveToHistory(prev);
      return prev.filter(t => t.id !== taskId);
    });
  }, [setTasks, saveToHistory]);

  /**
   * Move a task to a different column.
   *
   * Design Choice: Only updates the status field, preserving position
   * within the tasks array. Column components filter by status for display.
   */
  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => {
      saveToHistory(prev);
      return prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    });
  }, [setTasks, saveToHistory]);

  /**
   * Rename a task (triggered by double-click editing).
   */
  const renameTask = useCallback((taskId: string, newTitle: string) => {
    setTasks(prev => {
      saveToHistory(prev);
      return prev.map(t => (t.id === taskId ? { ...t, title: newTitle.trim() } : t));
    });
  }, [setTasks, saveToHistory]);

  /**
   * Replace entire task array (used for drag-and-drop reordering).
   *
   * @param saveHistory - Optional flag to skip history for intermediate states.
   * During drag operations, we only want to save history on drag end, not
   * during drag over events which fire frequently.
   */
  const reorderTasks = useCallback((reorderedTasks: Task[], saveHistory = true) => {
    setTasks(prev => {
      if (saveHistory) {
        saveToHistory(prev);
      }
      return reorderedTasks;
    });
  }, [setTasks, saveToHistory]);

  /**
   * Restore the previous state from history.
   *
   * Design Choice: Returns boolean to indicate success, allowing UI to
   * provide feedback if undo fails (e.g., nothing to undo).
   */
  const undo = useCallback(() => {
    if (history.length === 0) return false;

    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1)); // Remove last history entry
    setTasks(previousState); // Restore previous state
    return true;
  }, [history, setHistory, setTasks]);

  /**
   * Filter tasks by status for column display.
   * Memoized with tasks dependency to avoid unnecessary recalculations.
   */
  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return tasks.filter(t => t.status === status);
    },
    [tasks]
  );

  return {
    tasks,
    addTask,
    deleteTask,
    moveTask,
    renameTask,
    reorderTasks,
    undo,
    canUndo: history.length > 0,
    historyCount: history.length,
    getTasksByStatus,
  };
}
