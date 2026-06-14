import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExportNotes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    const saved = localStorage.getItem("notes");

    console.log("📦 Raw localStorage:", saved);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("✅ Parsed notes:", parsed);
        setNotes(parsed);
      } catch (err) {
        console.error("❌ JSON parse error:", err);
      }
    } else {
      console.log("⚠️ No notes found in localStorage");
    }
  }, []);
  const exportSingleNote = (note) => {
    const content = `
  Title: ${note.title || "No Title"}
  Content: ${note.body || "No Content"}
  Tags: ${note.tags?.map(t => `#${t}`).join(", ") || "None"}
  Date: ${new Date(note.createdAt).toLocaleString()}
  -----------------------
  `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title || "note"}.txt`;
    a.click();
  };

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
  <aside className="dash-sidebar">
    <h2>📝 NoteNest</h2>

    <button onClick={() => navigate("/dashboard")}>🏠 Notes</button>
    <button onClick={() => navigate("/archive")}>📦 Archive</button>
    <button className="active">⬇️ Export</button>
    <button onClick={() => navigate("/login")} className="logout-btn">
      🚪 Logout
    </button>
  </aside>

  <main className="dash-main">
    <h2>⬇️ Export Notes</h2>

    {notes.length === 0 ? (
      <p>No notes available</p>
    ) : (
      <div className="dash-notes-grid">
        {notes.map(note => (
          <div key={note.id} className="dash-note-card">
            <h3>{note.title}</h3>
            <p>{note.body?.substring(0, 80)}</p>

            <button
              onClick={() => exportSingleNote(note)}
              style={{ marginTop: "10px" }}
            >
              ⬇️ Download
            </button>
          </div>
        ))}
      </div>
    )}
  </main>
</div>
);
};

export default ExportNotes;