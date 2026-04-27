import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Archive = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notes")) || [];
    const archived = saved.filter(n => n.isArchived === true);
    setNotes(archived);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Archived Notes</h2>

      <button onClick={() => navigate("/dashboard")}>⬅ Back</button>

      {notes.length === 0 ? (
        <p>No archived notes</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Archive;