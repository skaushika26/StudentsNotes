import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import NoteModal from "./NoteModal";
import NoteToolbar from "./NoteToolbar";

const SAMPLE_NOTES = [
  {
    id: 1,
    title: "Welcome Note",
    body: "Click the 📦 icon to archive this note!",
    tags: ["welcome"],
    isPinned: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedNotes, setSelectedNotes] = useState([]);

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SAMPLE_NOTES;
      }
    }
    return SAMPLE_NOTES;
  });

  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Save to localStorage whenever notes change
  useEffect(() => {
    console.log("💾 Dashboard saving to localStorage:", notes);
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Filter and sort notes (exclude archived ones)
  let visibleNotes = notes.filter(n => !n.isArchived);

  if (search.trim()) {
    const q = search.toLowerCase();
    visibleNotes = visibleNotes.filter(
      n => (n.title && n.title.toLowerCase().includes(q)) ||
        (n.body && n.body.toLowerCase().includes(q))
    );
  }

  if (activeTag) {
    visibleNotes = visibleNotes.filter(n => n.tags && n.tags.includes(activeTag));
  }

  if (sortOrder === "newest") {
    visibleNotes = [...visibleNotes].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sortOrder === "oldest") {
    visibleNotes = [...visibleNotes].sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (sortOrder === "alpha") {
    visibleNotes = [...visibleNotes].sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );
  }

  const pinned = visibleNotes.filter(n => n.isPinned);
  const others = visibleNotes.filter(n => !n.isPinned);
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];

  // FIXED: Archive note function with verification
  const archiveNote = (id) => {
    console.log("📦 Archiving note with ID:", id);

    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => {
        if (note.id === id) {
          console.log("✅ Found note to archive:", note.title);
          return {
            ...note,
            isArchived: true,
            updatedAt: new Date().toISOString()
          };
        }
        return note;
      });

      const archivedCount = updatedNotes.filter(n => n.isArchived).length;
      console.log(`📦 Total archived notes after action: ${archivedCount}`);

      // Verify localStorage after update
      setTimeout(() => {
        const verify = JSON.parse(localStorage.getItem("notes") || "[]");
        console.log("🔍 Verification - Archived notes in localStorage:", verify.filter(n => n.isArchived).length);
      }, 100);

      return updatedNotes;
    });
  };

  const togglePin = (id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ));
  };

  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  // Handle file download
  const handleDownload = (attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    link.click();
  };
  const shareNote = (id) => {
    const saved = JSON.parse(localStorage.getItem("notes") || "[]");
    const updated = saved.map((n) =>
      n.id === id ? { ...n, isShared: !n.isShared } : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setNotes(updated);
    const note = updated.find((n) => n.id === id);
    alert(note.isShared ? "✅ Note shared publicly!" : "🔒 Note unshared.");
  };

  const renderNotes = (list) =>
    list.map((note) => (
      <div key={note.id} className="dash-note-card">

        <div className="note-actions">
          <span onClick={() => togglePin(note.id)}>📌</span>
          <span onClick={() => { setSelectedNote(note); setShowModal(true); }}>✏️</span>
          <span onClick={() => archiveNote(note.id)}>📦</span>
          {/* NEW: Share button */}
          <span onClick={() => shareNote(note.id)} title="Share publicly">🌐</span>
          <span onClick={() => deleteNote(note.id)}>🗑</span>
        </div>
        <h3>{note.title}</h3>
        <p>{note.body?.substring(0, 100)}</p>
        <div className="note-tags">
          {note.tags?.map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
        </div>

        {/* Display attachments */}
        {note.attachments && note.attachments.length > 0 && (
          <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #e2e8f0" }}>
            {note.attachments.map((att) => (
              <div
                key={att.id}
                onClick={() => handleDownload(att)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  background: "#f1f5f9",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginBottom: "4px"
                }}
              >
                <span>📎</span>
                <span>{att.name}</span>
                <span style={{ marginLeft: "auto", fontSize: "10px", color: "#64748b" }}>⬇️</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ));

  return (
    <div className="dash-root">
      <aside className="dash-sidebar">
        <h2>📝 NoteNest</h2>
        <button
          className={window.location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          🏠 Notes
        </button>
        <button onClick={() => navigate("/archive")}>
          📦 Archive
        </button>


        <button onClick={() => navigate("/login")} className="logout-btn">
          🚪 Logout

        </button>

        <button onClick={() => navigate("/shared")}>🌐 Shared Notes</button>
      </aside>

      <main className="dash-main">
        <button
          className="dash-new-btn"
          onClick={() => { setSelectedNote(null); setShowModal(true); }}
        >
          ➕ New Note
        </button>

        <NoteToolbar
          notes={notes}
          search={search}
          onSearchChange={setSearch}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          allTags={allTags}
        />

        {pinned.length > 0 && (
          <>
            <h3>📌 Pinned</h3>
            <div className="dash-notes-grid">{renderNotes(pinned)}</div>
          </>
        )}

        <h3>📄 Others</h3>
        {others.length === 0 && pinned.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "12px" }}>
            No notes yet. Click "New Note" to get started!
          </p>
        ) : (
          <div className="dash-notes-grid">{renderNotes(others)}</div>
        )}

        {showModal && (
          <NoteModal
            note={selectedNote}
            onClose={() => setShowModal(false)}
            onSave={(newNote) => {
              setNotes((prev) => {
                const exists = prev.find(n => n.id === newNote.id);
                if (exists) {
                  return prev.map(n => n.id === newNote.id ? {
                    ...newNote,
                    isArchived: n.isArchived,
                    isPinned: n.isPinned
                  } : n);
                }
                return [...prev, {
                  ...newNote,
                  id: Date.now(),
                  isPinned: false,
                  isArchived: false,
                  createdAt: new Date().toISOString()
                }];
              });
              setShowModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
}