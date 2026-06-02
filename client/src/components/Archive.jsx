import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Archive() {
  const navigate = useNavigate();
  const [archivedNotes, setArchivedNotes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      try {
        const allNotes = JSON.parse(saved);
        setArchivedNotes(allNotes.filter((n) => n.isArchived));
      } catch (e) {
        setArchivedNotes([]);
      }
    }
  }, []);

  const unarchiveNote = (id) => {
    const saved = JSON.parse(localStorage.getItem("notes") || "[]");
    const updated = saved.map((n) =>
      n.id === id ? { ...n, isArchived: false } : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setArchivedNotes(updated.filter((n) => n.isArchived));
  };

  const deleteNote = (id) => {
    if (window.confirm("Permanently delete this note?")) {
      const saved = JSON.parse(localStorage.getItem("notes") || "[]");
      const updated = saved.filter((n) => n.id !== id);
      localStorage.setItem("notes", JSON.stringify(updated));
      setArchivedNotes(updated.filter((n) => n.isArchived));
    }
  };

  return (
    <div className="dash-root">
      <aside className="dash-sidebar">
        <h2>📝 NoteNest</h2>
        <button onClick={() => navigate("/dashboard")}>🏠 Notes</button>
        <button className="active" onClick={() => navigate("/archive")}>
          📦 Archive
        </button>
        <button onClick={() => navigate("/shared")}>🌐 Shared Notes</button>
        <button onClick={() => navigate("/login")} className="logout-btn">
          🚪 Logout
        </button>
      </aside>

      <main className="dash-main">
        <h3>📦 Archived Notes</h3>
        {archivedNotes.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "12px" }}>
            No archived notes yet.
          </p>
        ) : (
          <div className="dash-notes-grid">
            {archivedNotes.map((note) => (
              <div key={note.id} className="dash-note-card">
                <div className="note-actions">
                  <span
                    title="Unarchive"
                    onClick={() => unarchiveNote(note.id)}
                  >
                    📤
                  </span>
                  <span title="Delete" onClick={() => deleteNote(note.id)}>
                    🗑
                  </span>
                </div>
                <h3>{note.title}</h3>
                <p>{note.body?.substring(0, 100)}</p>
                <div className="note-tags">
                  {note.tags?.map((tag, i) => (
                    <span key={i} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}