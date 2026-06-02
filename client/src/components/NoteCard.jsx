import React from 'react';
import './NoteCard.css';

export default function NoteCard({
  note,
  currentUserId,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onArchive,
  onPin,
  toolbar
}) {
  const authorId = note.author?._id || note.author;
  const isOwner = currentUserId && String(authorId) === String(currentUserId);
  const isArchived = note.isArchived === true;

  const authorName = note.author?.name || note.author?.email || 'Unknown';

  const formatDate = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`note-card ${note.isPinned ? 'pinned' : ''} ${isSelected ? 'selected' : ''} ${isArchived ? 'archived' : ''}`}>
      
      {/* DEBUG VISUAL INDICATOR - This will show you if you own the note */}
      <div style={{
        background: isOwner ? '#4caf50' : '#ff9800',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        marginBottom: '8px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        {isOwner 
          ? '✅ YOU OWN THIS NOTE (Edit/Archive/Delete buttons below)' 
          : `👤 NOT YOUR NOTE (Author ID: ${String(authorId).substring(0, 8)}... | Your ID: ${String(currentUserId).substring(0, 8)}...)`}
      </div>

      {/* Selection checkbox */}
      <label className="card-select">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </label>

      {/* Pinned indicator */}
      {note.isPinned && <div className="pin-badge">📌 Pinned</div>}

      {/* Archived indicator */}
      {isArchived && <div className="archived-badge">📦 Archived</div>}

      {/* Action toolbar */}
      <div className="card-actions">
        {isOwner && !isArchived && (
          <>
            <button className="card-btn" title="Pin / Unpin" onClick={onPin} type="button">
              {note.isPinned ? '📌' : '📍'} Pin
            </button>
            <button className="card-btn" title="Edit" onClick={onEdit} type="button">
              ✏️ Edit
            </button>
            <button className="card-btn" title="Archive" onClick={onArchive} type="button">
              📦 Archive
            </button>
            <button className="card-btn danger" title="Delete" onClick={onDelete} type="button">
              🗑️ Delete
            </button>
          </>
        )}
        
        {/* For archived notes */}
        {isOwner && isArchived && (
          <>
            <button className="card-btn" title="Restore" onClick={onArchive} type="button">
              ↩️ Restore
            </button>
            <button className="card-btn danger" title="Delete Permanently" onClick={onDelete} type="button">
              🗑️ Delete
            </button>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="card-title">{note.title || "Untitled"}</h3>

      {/* Content preview */}
      {note.content && (
        <p className="card-content">{note.content.substring(0, 160)}{note.content.length > 160 ? '…' : ''}</p>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="card-tags">
          {note.tags.map(tag => (
            <span key={tag} className="card-tag">#{tag}</span>
          ))}
        </div>
      )}

      {/* Attachments */}
      {note.attachments && note.attachments.length > 0 && (
        <div className="card-attachments">
          {note.attachments.map((att, i) => (
            <a
              key={i}
              href={`/uploads/${att.filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="attachment-chip"
            >
              📎 {att.originalName || att.filename}
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="card-author">
          <span className="author-avatar">{authorName.charAt(0).toUpperCase()}</span>
          <span className="author-name">
            {isOwner ? 'You' : authorName}
          </span>
        </div>
        <div className="card-meta">
          {note.createdAt && (
            <span className="meta-date">{formatDate(note.createdAt)}</span>
          )}
          <span className="meta-views">👁 {note.viewCount || 0}</span>
          {!note.isPublic && <span className="private-badge">🔒 Private</span>}
        </div>
      </div>
    </div>
  );
}