import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default function NoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const res = await API.get(`/notes/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content || "");
      setTags((res.data.tags || []).join(", "));
      setIsPublic(res.data.isPublic);
    } catch (err) {
      alert("Failed to load note");
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean)));
    formData.append("isPublic", isPublic);
    attachments.forEach(f => formData.append("attachments", f));

    try {
      if (id) {
        await API.put(`/notes/${id}`, formData);
      } else {
        await API.post("/notes", formData);
      }
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2>{id ? "Edit Note" : "Create New Note"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="file"
          multiple
          onChange={(e) => setAttachments(Array.from(e.target.files))}
          style={{ marginBottom: "10px" }}
        />
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Make this note public
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}