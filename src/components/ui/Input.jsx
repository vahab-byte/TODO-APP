import React from 'react';
import './Input.css';

const Input = ({ type = 'text', placeholder, value, onChange, name, label }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
};

export default Input;
