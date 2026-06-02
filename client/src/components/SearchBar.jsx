import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

/**
 * SearchBar
 * Props:
 *   value      – string
 *   onChange   – function(value: string)
 *   placeholder – string
 *   suggestions – string[] (optional autocomplete list)
 */
export default function SearchBar({ value, onChange, placeholder = 'Search notes…', suggestions = [] }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const filtered = suggestions.filter(
    s => s.toLowerCase().includes(value.toLowerCase()) && value.trim().length > 0
  ).slice(0, 6);

  const handleKey = e => {
    if (e.key === 'Escape') { onChange(''); setShowSuggestions(false); }
  };

  useEffect(() => {
    const handler = e => {
      if (!inputRef.current?.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="searchbar-root" ref={inputRef}>
      <div className="searchbar-inner">
        <span className="sb-icon">🔍</span>
        <input
          className="sb-input"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={e => { onChange(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKey}
        />
        {value && (
          <button className="sb-clear" onClick={() => { onChange(''); setShowSuggestions(false); }}>
            ✕
          </button>
        )}
      </div>

      {showSuggestions && filtered.length > 0 && (
        <ul className="sb-suggestions">
          {filtered.map((s, i) => (
            <li
              key={i}
              className="sb-suggestion"
              onMouseDown={() => { onChange(s); setShowSuggestions(false); }}
            >
              🔍 {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}