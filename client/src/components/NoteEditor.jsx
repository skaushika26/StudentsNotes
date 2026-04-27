import React from "react";
import { useNavigate } from "react-router-dom";

const NoteEditor = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create / Edit Note</h2>

      <input placeholder="Title" style={{ display: "block", marginBottom: "10px" }} />
      <textarea placeholder="Write your note..." rows="10" />

      <br /><br />

      <button>Save</button>
      <button onClick={() => navigate("/dashboard")}>Back</button>
    </div>
  );
};

export default NoteEditor;