import React, { useState } from 'react';
import { Check, Trash2, Edit2, X } from 'lucide-react';
import './TodoItem.css';

const TodoItem = ({ todo, toggleComplete, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Time formatter like "2 hrs ago" or "Just now" (keeping it simple for realistic code)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(todo.createdAt));

  // Formatter for due date
  let dueText = null;
  let isOverdue = false;
  if (todo.dueDate) {
    const due = new Date(todo.dueDate);
    dueText = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(due);
    // Check if overdue (start of today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today && !todo.completed) {
      isOverdue = true;
    }
  }

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      editTodo(todo.id, editText.trim());
    } else {
      setEditText(todo.text); // reset if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      {/* Priority Indicator on the left edge */}
      <div className={`priority-indicator ${todo.priority}`}></div>

      <div className="todo-content">
        <button 
          className={`checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => toggleComplete(todo.id)}
          aria-label="Toggle completion"
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="todo-details">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="edit-input"
              autoFocus
            />
          ) : (
            <span 
              className="todo-text" 
              onClick={() => toggleComplete(todo.id)}
            >
              {todo.text}
            </span>
          )}
          <div className="todo-meta">
            {todo.category && <span className={`category-badge ${todo.category}`}>{todo.category}</span>}
            {dueText && (
              <span className={`due-date ${isOverdue ? 'text-red' : ''}`}>
                Due: {dueText}
              </span>
            )}
            <span className="dot-separator">•</span>
            <span>{todo.priority} priority</span>
          </div>
        </div>
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <button className="action-btn cancel" onClick={() => setIsEditing(false)}>
            <X size={18} />
          </button>
        ) : (
          <button className="action-btn edit" onClick={() => setIsEditing(true)}>
            <Edit2 size={18} />
          </button>
        )}
        <button className="action-btn delete" onClick={() => deleteTodo(todo.id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
