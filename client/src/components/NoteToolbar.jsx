import React from "react";

const NoteToolbar = ({
  search,
  onSearchChange,
  activeTag,
  onTagChange,
  sortOrder,
  onSortChange,
  allTags,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Search */}
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {/* Tag Filter */}
      <select
        value={activeTag}
        onChange={(e) => onTagChange(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
      >
        <option value="">All</option>
        {allTags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      
    </div>
  );
};

export default NoteToolbar;