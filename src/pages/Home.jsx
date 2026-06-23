import React, { useState, useMemo, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import TodoForm from '../components/ui/TodoForm';
import TodoItem from '../components/ui/TodoItem';
import CustomSelect from '../components/ui/CustomSelect';
import PomodoroTimer from '../components/features/PomodoroTimer';
import { ListTodo, Activity, CheckCircle2, Search, Trash, Download, Upload } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [todos, setTodos] = useLocalStorage('smart-todos', []);
  const [filter, setFilter] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const fileInputRef = useRef(null);



  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'focus', 'stats'

  // --- CRUD Operations ---
  const addTodo = (newTodo) => {
    setTodos([newTodo, ...todos]); 
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const clearAll = () => {
    if(window.confirm('Are you sure you want to delete ALL tasks?')) {
      setTodos([]);
    }
  };

  // --- Export / Import ---
  const exportData = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTodos = JSON.parse(event.target.result);
        if (Array.isArray(importedTodos)) {
          // Schema Migration: Ensure old tasks have required fields
          const migratedTodos = importedTodos.map(todo => ({
            ...todo,
            priority: todo.priority || 'medium',
            category: todo.category || 'personal',
            createdAt: todo.createdAt || new Date().toISOString(),
            dueDate: todo.dueDate || null
          }));
          setTodos(migratedTodos);
          alert('Tasks imported successfully!');
        }
      } catch (err) {
        alert('Invalid file format. Please upload a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  // --- Derived State & Filtering ---
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, progress };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    let result = [...todos];
    
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        (t.text && t.text.toLowerCase().includes(q)) || 
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortOrder === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortOrder === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortOrder === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA;
      }
      return 0;
    });
    
    return result;
  }, [todos, filter, searchQuery, sortOrder]);

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  return (
    <div className="todo-dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="greeting">Good Morning! 👋</h1>
          <p className="subtitle">Let's get things done today.</p>
        </div>
        
        <div className="header-actions-right">
          <div className="data-actions">
            <button className="icon-btn-outline" onClick={exportData} title="Export JSON">
              <Download size={18} />
            </button>
            <button className="icon-btn-outline" onClick={() => fileInputRef.current?.click()} title="Import JSON">
              <Upload size={18} />
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImport}
            />
          </div>
          <div className="progress-badge">
            <span className="progress-text">{stats.progress}% Done</span>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern App Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <ListTodo size={18} /> My Tasks
        </button>
        <button 
          className={`nav-tab ${activeTab === 'focus' ? 'active' : ''}`}
          onClick={() => setActiveTab('focus')}
        >
          <Activity size={18} /> Focus Timer
        </button>
        <button 
          className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <CheckCircle2 size={18} /> Dashboard
        </button>
      </nav>

      <div className="tab-content-area">
        {activeTab === 'focus' && (
          <div className="focus-tab-content fade-in">
            <PomodoroTimer />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-tab-content fade-in">
            <div className="stats-container">
        <div className={`stat-card ${filter === 'all' ? 'active-filter' : ''}`} onClick={() => setFilter('all')}>
          <ListTodo className="stat-icon text-indigo" />
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className={`stat-card ${filter === 'active' ? 'active-filter' : ''}`} onClick={() => setFilter('active')}>
          <Activity className="stat-icon text-orange" />
          <div className="stat-info">
            <h3>{stats.active}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className={`stat-card ${filter === 'completed' ? 'active-filter' : ''}`} onClick={() => setFilter('completed')}>
          <CheckCircle2 className="stat-icon text-green" />
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="todo-main-section fade-in">
            <TodoForm addTodo={addTodo} />

            <div className="todo-list-container">
              
              {/* Action Bar: Search, Sort and Clear All */}
              <div className="action-bar">
                <div className="search-wrapper">
                  <Search className="search-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search tasks or categories..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <CustomSelect 
                  options={[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'priority', label: 'Highest Priority' }
                  ]}
                  value={sortOrder}
                  onChange={setSortOrder}
                  className="sort-select-custom"
                />

                {todos.length > 0 && (
                   <button className="clear-all-btn" onClick={clearAll}>
                     <Trash size={16} /> Clear All
                   </button>
                )}
              </div>

              <div className="list-header">
                <h2>{filter === 'all' ? 'All Tasks' : filter === 'active' ? 'Active Tasks' : 'Completed Tasks'}</h2>
                {stats.completed > 0 && filter !== 'active' && (
                  <button className="clear-btn" onClick={clearCompleted}>
                    Clear Completed
                  </button>
                )}
              </div>

              <div className="todo-list">
                {filteredTodos.length === 0 ? (
                  <div className="empty-state">
                    <img src="https://illustrations.popsy.co/amber/taking-notes.svg" alt="Empty list" className="empty-img" />
                    <h3>No tasks found</h3>
                    <p>{searchQuery ? 'Try adjusting your search.' : 'Relax, you have nothing on your plate right now!'}</p>
                  </div>
                ) : (
                  filteredTodos.map(todo => (
                    <TodoItem 
                      key={todo.id} 
                      todo={todo} 
                      toggleComplete={toggleComplete}
                      deleteTodo={deleteTodo}
                      editTodo={editTodo}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
