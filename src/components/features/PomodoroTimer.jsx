import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  // Human-like: Using standard Pomodoro times (25 mins work, 5 mins break)
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  // Handling the countdown logic
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished! Play a sound or switch modes
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // When timer hits 0, switch between work and break automatically
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (mode === 'work') {
      // Time for a break!
      setMode('break');
      setTimeLeft(BREAK_TIME);
      // Extra touch: A simple browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('Great job! Time for a 5-minute break. ☕');
      }
    } else {
      // Back to work!
      setMode('work');
      setTimeLeft(WORK_TIME);
      if (Notification.permission === 'granted') {
        new Notification('Break is over! Let us focus again. 🧠');
      }
    }
  }, [mode]);

  // Request notification permissions on mount (very human/pro feature)
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Calculate progress for the SVG circle
  const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime);
  
  // SVG Circle Math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className={`pomodoro-widget ${mode} ${isRunning ? 'is-running' : ''}`}>
      <div className="pomodoro-header">
        <h3 className="widget-title">
          {mode === 'work' ? 'Deep Work' : 'Rest Area'}
        </h3>
        <div className="mode-tabs">
          <button 
            className={`tab-btn ${mode === 'work' ? 'active' : ''}`}
            onClick={() => switchMode('work')}
          >
            <Brain size={14} />
          </button>
          <button 
            className={`tab-btn ${mode === 'break' ? 'active' : ''}`}
            onClick={() => switchMode('break')}
          >
            <Coffee size={14} />
          </button>
        </div>
      </div>

      <div className="pomodoro-timer-body">
        <div className="timer-ring-wrapper">
          <svg className="timer-svg" width="160" height="160">
            <circle 
              className="timer-bg-ring"
              cx="80" cy="80" r={radius} 
            />
            <circle 
              className="timer-progress-ring"
              cx="80" cy="80" r={radius} 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="timer-countdown">
            <h2>{formatTime(timeLeft)}</h2>
            <span className="timer-status">
              {isRunning ? (mode === 'work' ? 'Focusing...' : 'Relaxing...') : 'Paused'}
            </span>
          </div>
        </div>

        <div className="timer-controls-modern">
          <button className="btn-modern play-btn" onClick={toggleTimer}>
            {isRunning ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
          </button>
          <button className="btn-modern reset-btn" onClick={resetTimer} title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
