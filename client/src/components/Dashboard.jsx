import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const NoteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const SAMPLE_NOTES = [
  { id: 1, title: "Getting started with NoteNest", body: "Welcome! This is your personal space to write, share, and discover ideas. Start by creating your first note.", tag: "Welcome", time: "Just now" },
  { id: 2, title: "Ideas for my next project", body: "Build a real-time collaborative editor. Add markdown support, inline comments, and version history.", tag: "Ideas", time: "2 min ago" },
  { id: 3, title: "Reading list", body: "Atomic Habits · The Design of Everyday Things · A Philosophy of Software Design · Deep Work.", tag: "Books", time: "5 min ago" },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Good day");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    setUser(JSON.parse(stored));

    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="dash-root">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="dash-brand-icon"><NoteIcon /></span>
          <span className="dash-brand-name">NoteNest</span>
        </div>

        <nav className="dash-nav">
          {[
            { label: "All Notes",   icon: "📄", active: true },
            { label: "Shared",      icon: "🔗" },
            { label: "Favourites",  icon: "⭐" },
            { label: "Archive",     icon: "📦" },
          ].map(({ label, icon, active }) => (
            <button key={label} className={`dash-nav-item${active ? " active" : ""}`}>
              <span className="dash-nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-avatar-row">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-user-info">
              <span className="dash-user-name">{user?.name || "User"}</span>
              <span className="dash-user-email">{user?.email || ""}</span>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout}>
            <LogoutIcon /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        {/* Header */}
        <header className="dash-header">
          <div className="dash-header-left">
            <h1 className="dash-greeting">{greeting}, {user?.name?.split(" ")[0] || "there"} 👋</h1>
            <p className="dash-header-sub">You have {SAMPLE_NOTES.length} notes · {new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}</p>
          </div>
          <button className="dash-new-btn">
            <PlusIcon /> New note
          </button>
        </header>

        {/* Stats */}
        <div className="dash-stats">
          {[
            { label: "Total Notes",   value: "3",  icon: "📝" },
            { label: "Shared Notes",  value: "1",  icon: "🔗" },
            { label: "This Week",     value: "3",  icon: "📅" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="dash-stat-card">
              <span className="dash-stat-icon">{icon}</span>
              <span className="dash-stat-value">{value}</span>
              <span className="dash-stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Notes grid */}
        <section className="dash-section">
          <h2 className="dash-section-title">Recent Notes</h2>
          <div className="dash-notes-grid">
            {SAMPLE_NOTES.map((note, i) => (
              <div key={note.id} className="dash-note-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="dash-note-top">
                  <span className="dash-note-tag">{note.tag}</span>
                  <span className="dash-note-time">{note.time}</span>
                </div>
                <h3 className="dash-note-title">{note.title}</h3>
                <p className="dash-note-body">{note.body}</p>
                <div className="dash-note-footer">
                  <button className="dash-note-btn">Open</button>
                  <button className="dash-note-btn ghost">Share</button>
                </div>
              </div>
            ))}

            {/* New note card */}
            <div className="dash-note-card new-card">
              <PlusIcon />
              <span>Create new note</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
