import React, { useState } from "react";
import "./Dashboard.css";

const NoteModal = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.body || "");
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [attachments, setAttachments] = useState(note?.attachments || []);

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

  // ✅ Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      data: URL.createObjectURL(file) // For preview/download
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  // ✅ Remove attachment
  const removeAttachment = (attachmentId) => {
    setAttachments(attachments.filter(att => att.id !== attachmentId));
  };

  // ✅ Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // ✅ Get file icon based on type
  const getFileIcon = (type) => {
    if (type.includes("image")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("text")) return "📝";
    if (type.includes("video")) return "🎥";
    if (type.includes("audio")) return "🎵";
    return "📎";
  };

  // ✅ Save note
  const handleSave = () => {
    onSave({
      id: note?.id || Date.now(),
      title,
      body: content,
      tags,
      attachments: attachments,
      updatedAt: new Date().toISOString()
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
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
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

        {/* File Upload Section */}
        <div style={{ 
          marginTop: "15px", 
          padding: "12px", 
          background: "#f8fafc", 
          borderRadius: "8px" 
        }}>
          <label style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "#3b82f6",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}>
            📎 Attach Files
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <strong>Attachments ({attachments.length})</strong>
              <div style={{ marginTop: "8px" }}>
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px",
                      background: "white",
                      borderRadius: "6px",
                      marginBottom: "6px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{getFileIcon(att.type)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: "500" }}>{att.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{formatFileSize(att.size)}</div>
                    </div>
                    <button
                      onClick={() => removeAttachment(att.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "4px 8px",
                        borderRadius: "4px"
                      }}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;