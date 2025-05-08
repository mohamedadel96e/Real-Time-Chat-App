
import React from "react";
import "../styles/alert.css"; 

export default function Toast({ type = "error", title, description, onClose }) {
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
      
        <div className="toast-text">
    
          <p className="toast-title">{title}</p>
          <span>{description}</span>
       
        
        </div>
        <button onClick={onClose} className="toast-close">
          ✕
        </button>
      </div>
    </div>
  );
}
