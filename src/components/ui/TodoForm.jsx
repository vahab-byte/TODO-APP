import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CustomSelect from './CustomSelect';
import './TodoForm.css';

const TodoForm = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    addTodo({
      id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2),
      text: text.trim(),
      completed: false,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdAt: new Date().toISOString()
    });

    setText('');
    setPriority('medium');
    setCategory('personal');
    setDueDate('');
  };

  const categoryOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'health', label: 'Health' },
    { value: 'study', label: 'Study' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Med Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-top-row">
        <input
          type="text"
          placeholder="What needs to be done?..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="todo-input"
          id="main-todo-input"
        />
        <button type="submit" className="add-btn" disabled={!text.trim()}>
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="form-bottom-row">
        <input 
          type="date" 
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
          title="Optional Due Date"
        />

        <div className="options-row">
          <div className="pill-group">
            {categoryOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`pill category-pill ${category === opt.value ? 'active' : ''}`}
                onClick={() => setCategory(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="pill-group">
            {priorityOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`pill priority-pill ${opt.value} ${priority === opt.value ? 'active' : ''}`}
                onClick={() => setPriority(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
