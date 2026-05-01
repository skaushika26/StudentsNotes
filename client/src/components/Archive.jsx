import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Archive.css";

export default function Archive() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");

  // Load notes from localStorage
  const loadNotes = () => {
    try {
      const saved = localStorage.getItem("notes");
      console.log("📖 Archive loading from localStorage:", saved);
      const parsed = saved ? JSON.parse(saved) : [];
      console.log("📝 Archive parsed notes:", parsed);
      console.log("🗄️ Archived notes found:", parsed.filter(n => n.isArchived === true).length);
      setNotes(parsed);
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // DEBUG: Log current state
  useEffect(() => {
    console.log("🔍 Archive state - notes:", notes);
    console.log("🔍 Archive state - archived:", notes.filter(n => n.isArchived === true));
  }, [notes]);

  // Restore note
  const restoreNote = (id) => {
    console.log("↩️ Restoring note:", id);
    const updated = notes.map(n =>
      n.id === id ? { ...n, isArchived: false, updatedAt: new Date().toISOString() } : n
    );
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
    console.log("✅ Note restored, updated localStorage");
  };

  // Delete note permanently
  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this note?")) {
      console.log("🗑 Deleting note:", id);
      const updated = notes.filter(n => n.id !== id);
      setNotes(updated);
      localStorage.setItem("notes", JSON.stringify(updated));
      console.log("✅ Note deleted, updated localStorage");
    }
  };

  // Handle file download
  const handleDownload = (attachment) => {
    if (attachment.data) {
      const link = document.createElement('a');
      link.href = attachment.data;
      link.download = attachment.name;
      link.click();
    } else {
      console.error("No file data available");
      alert("File data not available. Please re-upload the file.");
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (!type) return "📎";
    if (type.includes("image")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("text")) return "📝";
    if (type.includes("video")) return "🎥";
    if (type.includes("audio")) return "🎵";
    if (type.includes("zip") || type.includes("rar")) return "📦";
    return "📎";
  };

  const allArchived = notes.filter((n) => n.isArchived === true);
  const allTags = [...new Set(allArchived.flatMap((n) => n.tags || []))];

  const filtered = allArchived.filter((n) => {
    const matchSearch =
      search.trim() === "" ||
      (n.title && n.title.toLowerCase().includes(search.toLowerCase())) ||
      (n.body && n.body.toLowerCase().includes(search.toLowerCase()));
    
    const matchTag = activeTag === "" || (n.tags && n.tags.includes(activeTag));
    
    return matchSearch && matchTag;
  });

  return (
    <div className="arch-root">
      <aside className="arch-sidebar">
        <h2 className="arch-logo">📝 NoteNest</h2>
        <nav className="arch-nav">
          <button className="arch-nav-btn" onClick={() => navigate("/dashboard")}>
            🏠 Notes
          </button>
          <button className="arch-nav-btn arch-nav-active">
            📦 Archive
          </button>
        </nav>
      </aside>

      <main className="arch-main">
        <div className="arch-header">
          <h2 className="arch-title">Archive</h2>
          <span className="arch-subtitle">
            {filtered.length} of {allArchived.length} note{allArchived.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="arch-search-wrap">
          <span className="arch-search-icon">🔍</span>
          <input
            className="arch-search"
            type="text"
            placeholder="Search archived notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="arch-search-clear" onClick={() => setSearch("")}>×</button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="arch-tag-row">
            <button
              className={`arch-chip ${activeTag === "" ? "arch-chip-active" : ""}`}
              onClick={() => setActiveTag("")}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`arch-chip ${activeTag === tag ? "arch-chip-active" : ""}`}
                onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {allArchived.length === 0 ? (
          <div className="arch-empty">
            <div className="arch-empty-icon">🗃️</div>
            <p>No archived notes yet.</p>
            <small>Archive a note from your dashboard to see it here.</small>
            <button 
              onClick={() => navigate("/dashboard")}
              style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}
            >
              Go to Dashboard →
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="arch-empty">
            <div className="arch-empty-icon">🔍</div>
            <p>No results found.</p>
            <small>Try a different search term or tag.</small>
          </div>
        ) : (
          <div className="arch-grid">
            {filtered.map((note) => (
              <div key={note.id} className="arch-card">
                <div className="arch-card-actions">
                  <button className="arch-btn arch-btn-restore" onClick={() => restoreNote(note.id)}>
                    ↩️ Restore
                  </button>
                  <button className="arch-btn arch-btn-delete" onClick={() => deleteNote(note.id)}>
                    🗑 Delete
                  </button>
                </div>
                <h3 className="arch-card-title">{note.title || "Untitled"}</h3>
                <p className="arch-card-body">{note.body || "No content"}</p>
                
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="arch-card-tags">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="arch-tag">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Attachments Section */}
                {note.attachments && note.attachments.length > 0 && (
                  <div className="arch-card-attachments">
                    <div className="attachments-header">📎 Attachments ({note.attachments.length})</div>
                    {note.attachments.map((att) => (
                      <div 
                        key={att.id} 
                        className="arch-attachment-item"
                        onClick={() => handleDownload(att)}
                        title="Download"
                      >
                        <span className="attachment-icon">{getFileIcon(att.type)}</span>
                        <div className="attachment-details">
                          <span className="attachment-name">{att.name}</span>
                          <span className="attachment-size">{formatFileSize(att.size)}</span>
                        </div>
                        <span className="download-icon">⬇️</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="arch-badge">Archived</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}