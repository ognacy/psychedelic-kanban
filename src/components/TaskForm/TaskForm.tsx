import { useState, FormEvent } from 'react';
import './TaskForm.css';

interface TaskFormProps {
  onAdd: (title: string) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__input-wrapper">
        <span className="task-form__prompt">&gt;</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="MANIFEST YOUR REALITY..."
          className="task-form__input"
          autoComplete="off"
        />
        <span className="task-form__cursor"></span>
      </div>
      <button type="submit" className="task-form__button">
        [CREATE]
      </button>
    </form>
  );
}
