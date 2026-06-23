import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Todo List</h2>
      </div>
      
      <div className="navbar-right">
        <div className="time-display">
          {formattedTime}
        </div>


        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        <div className="user-avatar">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User Avatar" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
