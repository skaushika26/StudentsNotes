import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import NoteModal from "./NoteModal";

const SAMPLE_NOTES = [
  {
    id: 1,
    title: "Welcome Note",
    body: "This is your first note",
    tags: ["welcome"],
    isPinned: false,
    isArchived: false,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ LOAD FROM LOCALSTORAGE
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : SAMPLE_NOTES;
  });

  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // FILTER
  const visibleNotes = notes.filter(n => !n.isArchived);
  const pinned = visibleNotes.filter(n => n.isPinned);
  const others = visibleNotes.filter(n => !n.isPinned);

  // ACTIONS
  const togglePin = (id) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isPinned: !n.isPinned } : n
      )
    );
  };

  const archiveNote = (id) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isArchived: true } : n
      )
    );
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const renderNotes = (list) =>
    list.map((note) => (
      <div key={note.id} className="dash-note-card">

        {/* ACTION ICONS */}
        <div className="note-actions">
          <span onClick={() => togglePin(note.id)}>📌</span>
          <span onClick={() => { setSelectedNote(note); setShowModal(true); }}>✏️</span>
          <span onClick={() => archiveNote(note.id)}>📦</span>
          <span onClick={() => deleteNote(note.id)}>🗑</span>
        </div>

        <h3>{note.title}</h3>
        <p>{note.body}</p>

        {/* TAGS */}
        <div>
          {note.tags?.map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    ));

  return (
    <div className="dash-root">

      {/* Sidebar */}
      <aside className="dash-sidebar">
        <h2>NoteNest</h2>
        <button onClick={() => navigate("/dashboard")}>🏠 Notes</button>
        <button onClick={() => navigate("/archive")}>📦 Archive</button>
      </aside>

      {/* Main */}
      <main className="dash-main">

        <button
          className="dash-new-btn"
          onClick={() => {
            setSelectedNote(null);
            setShowModal(true);
          }}
        >
          ➕ New Note
        </button>

        {/* PINNED */}
        {pinned.length > 0 && (
          <>
            <h3>Pinned</h3>
            <div className="dash-notes-grid">{renderNotes(pinned)}</div>
          </>
        )}

        {/* OTHERS */}
        <h3>Others</h3>
        <div className="dash-notes-grid">{renderNotes(others)}</div>

        {/* MODAL */}
        {showModal && (
          <NoteModal
            note={selectedNote}
            onClose={() => setShowModal(false)}
            onSave={(newNote) => {
              setNotes((prev) => {
                const exists = prev.find(n => n.id === newNote.id);
                if (exists) {
                  return prev.map(n =>
                    n.id === newNote.id ? newNote : n
                  );
                }
                return [...prev, { ...newNote, isPinned: false, isArchived: false }];
              });
            }}
          />
        )}
      </main>
    </div>
  );
}