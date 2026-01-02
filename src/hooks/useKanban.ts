import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task, TaskStatus } from '../types';

const STORAGE_KEY = 'retro-kanban-tasks';
const HISTORY_KEY = 'retro-kanban-history';
const MAX_HISTORY = 25;

export function useKanban() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);
  const [history, setHistory] = useLocalStorage<Task[][]>(HISTORY_KEY, []);

  const saveToHistory = useCallback((currentTasks: Task[]) => {
    setHistory(prev => {
      const newHistory = [...prev, currentTasks];
      if (newHistory.length > MAX_HISTORY) {
        return newHistory.slice(-MAX_HISTORY);
      }
      return newHistory;
    });
  }, [setHistory]);

  const addTask = useCallback((title: string) => {
    setTasks(prev => {
      saveToHistory(prev);
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        status: 'todo',
        createdAt: Date.now(),
      };
      return [...prev, newTask];
    });
  }, [setTasks, saveToHistory]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      saveToHistory(prev);
      return prev.filter(t => t.id !== taskId);
    });
  }, [setTasks, saveToHistory]);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => {
      saveToHistory(prev);
      return prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    });
  }, [setTasks, saveToHistory]);

  const renameTask = useCallback((taskId: string, newTitle: string) => {
    setTasks(prev => {
      saveToHistory(prev);
      return prev.map(t => (t.id === taskId ? { ...t, title: newTitle.trim() } : t));
    });
  }, [setTasks, saveToHistory]);

  const reorderTasks = useCallback((reorderedTasks: Task[], saveHistory = true) => {
    setTasks(prev => {
      if (saveHistory) {
        saveToHistory(prev);
      }
      return reorderedTasks;
    });
  }, [setTasks, saveToHistory]);

  const undo = useCallback(() => {
    if (history.length === 0) return false;

    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setTasks(previousState);
    return true;
  }, [history, setHistory, setTasks]);

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
