import React from "react";
import { useNavigate } from "react-router-dom";

const NotesList = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Notes</h2>

      <button onClick={() => navigate("/notes/new")}>+ New Note</button>

      <ul>
        <li onClick={() => navigate("/notes/1")}>Sample Note 1</li>
        <li onClick={() => navigate("/notes/2")}>Sample Note 2</li>
      </ul>
    </div>
  );
};

export default NotesList;