import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExportNotes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
 
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("notes")) || [];
    const selected = JSON.parse(localStorage.getItem("selectedNotes")) || [];

    setSelectedIds(selected);

    const filtered = all.filter(n => selected.includes(n.id));
    setNotes(filtered);
    }, []);

  const exportAsJSON = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.json";
    a.click();
  };

  const exportAsText = () => {
    const data = notes
      .map(note => `${note.title}\n${note.body}\n\n`)
      .join("");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.txt";
    a.click();
  };

  return (
  <div className="dash-root">
    
    {/* Sidebar (same as dashboard) */}
    <aside className="dash-sidebar">
      <h2>📝 NoteNest</h2>

      <button onClick={() => navigate("/dashboard")}>🏠 Notes</button>
      <button onClick={() => navigate("/archive")}>📦 Archive</button>
      <button className="active">⬇️ Export</button>
      <button onClick={() => navigate("/login")} className="logout-btn">
        🚪 Logout
      </button>
    </aside>

    {/* Main Content */}
    <main className="dash-main">
      <div className="export-card">
        <h2>⬇️ Export Notes</h2>
        <p>Total Notes: <strong>{notes.length}</strong></p>
        <p>Selected Notes: {notes.length}</p>


        <div className="export-buttons">
          <button onClick={exportAsJSON}>Download JSON</button>
          <button onClick={exportAsText}>Download Text</button>
        </div>
      </div>
    </main>
  </div>
);
};

export default ExportNotes;