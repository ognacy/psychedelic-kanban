/**
 * TaskForm Component
 *
 * Input form for creating new tasks with a retro terminal aesthetic.
 *
 * Design Choices:
 * - Controlled input: React state as single source of truth for input value
 * - Form submission: Handles both button click and Enter key naturally
 * - Clear on submit: Resets input for rapid task entry
 * - Trim whitespace: Prevents empty or whitespace-only tasks
 */

import { useState, FormEvent } from 'react';
import './TaskForm.css';

interface TaskFormProps {
  onAdd: (title: string) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  /**
   * Controlled input state.
   * Using useState over useRef because we need to clear the input after submit.
   */
  const [title, setTitle] = useState('');

  /**
   * Handle form submission.
   *
   * Design Choice: Using form onSubmit instead of button onClick enables
   * native Enter key support without additional keyboard event handling.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (title.trim()) {
      onAdd(title.trim());
      setTitle(''); // Clear input for next task
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/*
        Input wrapper provides the visual container with psychedelic borders.
        Semantic structure: wrapper for styling, input for functionality.
      */}
      <div className="task-form__input-wrapper">
        {/* Terminal-style prompt character */}
        <span className="task-form__prompt">&gt;</span>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="MANIFEST YOUR REALITY..."
          className="task-form__input"
          autoComplete="off" // Prevent browser autocomplete dropdown
        />

        {/* Animated blinking cursor for retro effect */}
        <span className="task-form__cursor"></span>
      </div>

      {/*
        Submit button.
        type="submit" connects to form onSubmit handler.
      */}
      <button type="submit" className="task-form__button">
        [CREATE]
      </button>
    </form>
  );
}
