import React, { useState } from "react";
import "./Dashboard.css";

const NoteModal = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.body || "");
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState("");

  // ✅ Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // ✅ Remove tag
  const removeTag = (i) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  // ✅ Save note
  const handleSave = () => {
    onSave({
      id: note?.id || Date.now(),
      title,
      body: content,
      tags,
    });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">

        <h2>{note ? "Edit Note" : "New Note"}</h2>

        {/* Title */}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Body */}
        <textarea
          placeholder="Write your note..."
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Tag input */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <button onClick={addTag}>Add</button>
        </div>

        {/* Tag list */}
        <div style={{ marginTop: "10px" }}>
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: "#eef2ff",
                color: "#4f46e5",
                padding: "4px 8px",
                borderRadius: "6px",
                margin: "5px",
                cursor: "pointer"
              }}
              onClick={() => removeTag(i)}
            >
              #{tag} ❌
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "15px" }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
};

export default NoteModal;