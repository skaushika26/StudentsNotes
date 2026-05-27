import React from 'react';
import './TagCloud.css';

/**
 * TagCloud
 * Props:
 *   tags        – [{ tag: string, count: number }]  (sorted by count desc)
 *   selectedTag – string, currently active tag
 *   onSelectTag – function(tag: string)
 */
export default function TagCloud({ tags, selectedTag, onSelectTag }) {
  if (!tags || tags.length === 0) return null;

  const maxCount = tags[0]?.count || 1;

  // Map count → font-size tier
  const sizeClass = count => {
    const ratio = count / maxCount;
    if (ratio > 0.75) return 'tag-xl';
    if (ratio > 0.5)  return 'tag-lg';
    if (ratio > 0.25) return 'tag-md';
    return 'tag-sm';
  };

  return (
    <div className="tag-cloud-wrapper">
      <div className="tag-cloud-header">
        <span className="tag-cloud-title">🏷️ Popular Tags</span>
        {selectedTag !== 'All' && (
          <button className="tag-cloud-clear" onClick={() => onSelectTag('All')}>
            Clear filter ✕
          </button>
        )}
      </div>
      <div className="tag-cloud">
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            className={`cloud-tag ${sizeClass(count)} ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => onSelectTag(selectedTag === tag ? 'All' : tag)}
            title={`${count} note${count !== 1 ? 's' : ''}`}
          >
            #{tag}
            <span className="tag-count">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}