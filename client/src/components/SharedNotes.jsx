import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function SharedNotes() {
  const navigate = useNavigate();
  const [sharedNotes, setSharedNotes] = useState([]);
  const [copyMsg, setCopyMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      try {
        const allNotes = JSON.parse(saved);
        setSharedNotes(allNotes.filter((n) => n.isShared && !n.isArchived));
      } catch {
        setSharedNotes([]);
      }
    }
  }, []);

  const unshareNote = (id) => {
    const saved = JSON.parse(localStorage.getItem("notes") || "[]");
    const updated = saved.map((n) =>
      n.id === id ? { ...n, isShared: false } : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setSharedNotes(updated.filter((n) => n.isShared && !n.isArchived));
  };

  const copyLink = (id) => {
    const fakeLink = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(fakeLink).then(() => {
      setCopyMsg(id);
      setTimeout(() => setCopyMsg(""), 2000);
    });
  };

  return (
    <div className="dash-root">
      <aside className="dash-sidebar">
        <h2>📝 NoteNest</h2>
        <button onClick={() => navigate("/dashboard")}>🏠 Notes</button>
        <button onClick={() => navigate("/archive")}>📦 Archive</button>
        <button className="active" onClick={() => navigate("/shared")}>
          🌐 Shared Notes
        </button>
        <button onClick={() => navigate("/login")} className="logout-btn">
          🚪 Logout
        </button>
      </aside>

      <main className="dash-main">
        <h3>🌐 Shared Notes</h3>
        <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>
          These notes are publicly shared. Click 🔗 to copy the link.
        </p>

        {sharedNotes.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "12px" }}>
            No shared notes yet. Click 🌐 on any note to share it.
          </p>
        ) : (
          <div className="dash-notes-grid">
            {sharedNotes.map((note) => (
              <div
                key={note.id}
                className="dash-note-card"
                style={{ borderLeft: "3px solid #6366f1" }}
              >
                <div className="note-actions">
                  <span
                    title="Copy share link"
                    onClick={() => copyLink(note.id)}
                  >
                    {copyMsg === note.id ? "✅" : "🔗"}
                  </span>
                  <span title="Unshare" onClick={() => unshareNote(note.id)}>
                    🔒
                  </span>
                </div>
                <h3>{note.title}</h3>
                <p>{note.body?.substring(0, 120)}</p>
                <div className="note-tags">
                  {note.tags?.map((tag, i) => (
                    <span key={i} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                {note.attachments?.length > 0 && (
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#64748b" }}>
                    📎 {note.attachments.length} attachment(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}