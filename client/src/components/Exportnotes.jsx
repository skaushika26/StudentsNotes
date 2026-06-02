import React, { useState } from 'react';
import './ExportNotes.css';
import './ExportNotes.css';

/**
 * ExportNotes
 * Props:
 *   notes       – full notes array currently shown
 *   selectedIds – array of selected note _id strings
 */
export default function ExportNotes({ notes = [], selectedIds = [] }) {
  const [open, setOpen] = useState(false);

  const targetNotes = selectedIds.length > 0
    ? notes.filter(n => selectedIds.includes(n._id))
    : notes;

  const exportAsJSON = () => {
    const data = JSON.stringify(targetNotes, null, 2);
    download(data, 'notes.json', 'application/json');
    setOpen(false);
  };

  const exportAsText = () => {
    const data = targetNotes.map(n =>
      `# ${n.title}\n${n.content || ''}\nTags: ${(n.tags || []).join(', ')}\n`
    ).join('\n---\n\n');
    download(data, 'notes.txt', 'text/plain');
    setOpen(false);
  };

  const exportAsCSV = () => {
    const header = 'Title,Content,Tags,Author,Created\n';
    const rows = targetNotes.map(n => {
      const title   = `"${(n.title   || '').replace(/"/g, '""')}"`;
      const content = `"${(n.content || '').replace(/"/g, '""')}"`;
      const tags    = `"${(n.tags || []).join(', ')}"`;
      const author  = `"${n.author?.name || n.author?.email || ''}"`;
      const date    = `"${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}"`;
      return [title, content, tags, author, date].join(',');
    }).join('\n');
    download(header + rows, 'notes.csv', 'text/csv');
    setOpen(false);
  };

  const download = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-wrapper">
      <button
        className="btn-export"
        onClick={() => setOpen(o => !o)}
        title="Export notes"
      >
        ⬇ Export{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
      </button>

      {open && (
        <>
          <div className="export-backdrop" onClick={() => setOpen(false)} />
          <div className="export-menu">
            <div className="export-menu-header">
              {selectedIds.length > 0
                ? `Export ${selectedIds.length} selected note${selectedIds.length !== 1 ? 's' : ''}`
                : `Export all ${notes.length} notes`}
            </div>
            <button className="export-option" onClick={exportAsJSON}>
              <span>{ }</span> JSON
            </button>
            <button className="export-option" onClick={exportAsText}>
              <span>📄</span> Plain Text
            </button>
            <button className="export-option" onClick={exportAsCSV}>
              <span>📊</span> CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}