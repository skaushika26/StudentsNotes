const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');
const multer = require('multer');


// ─── Multer setup (keep existing) ───────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// ─── GET /api/notes  →  ALL public, non-archived notes ───────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { sort } = req.query;
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'views')  sortOption = { viewCount: -1 };

    const notes = await Note.find({ isPublic: true, isArchived: false })
      .populate('author', 'name email')
      .sort(sortOption);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/notes/my  →  Current user's notes only ────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const { sort } = req.query;
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'views')  sortOption = { viewCount: -1 };

    const notes = await Note.find({ author: req.user._id, isArchived: false })
      .populate('author', 'name email')
      .sort(sortOption);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/notes/search?q=&tag=&mode=all|my ───────────────────────────────
router.get('/search', protect, async (req, res) => {
  try {
    const { q, tag, mode } = req.query;

    let query = { isArchived: false };
    if (mode === 'my') {
      query.author = req.user._id;
    } else {
      query.isPublic = true;
    }

    if (q && q.trim()) {
      query.$or = [
        { title:   { $regex: q.trim(), $options: 'i' } },
        { content: { $regex: q.trim(), $options: 'i' } }
      ];
    }

    if (tag && tag !== 'All') {
      query.tags = tag;
    }

    const notes = await Note.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/notes/tags  →  All unique tags across public notes ─────────────
router.get('/tags', protect, async (req, res) => {
  try {
    const notes = await Note.find({ isPublic: true, isArchived: false }, 'tags');
    const tagMap = {};
    notes.forEach(note => {
      (note.tags || []).forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    // Return array sorted by frequency: [{ tag, count }, ...]
    const tags = Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/notes/archive  →  Current user's archived notes ───────────────
router.get('/archive', protect, async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user._id, isArchived: true })
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/notes/:id  →  Single note (increment view count) ───────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'name email');

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (!note.isPublic && String(note.author._id) !== req.user._id)
      return res.status(403).json({ message: 'Access denied' });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/notes  →  Create note (author = logged-in user) ───────────────
router.post('/', protect, upload.array('attachments'), async (req, res) => {
  try {
    const { title, content, tags, isPublic } = req.body;

    const attachments = (req.files || []).map(file => ({
      filename:     file.filename,
      originalName: file.originalname,
      mimetype:     file.mimetype,
      size:         file.size,
      path:         file.path
    }));

    const note = new Note({
      title,
      content,
      tags:        tags ? JSON.parse(tags) : [],
      isPublic:    isPublic !== undefined ? isPublic : true,
      author:      req.user._id,
      attachments
    });

    await note.save();
    await note.populate('author', 'name email');
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── PUT /api/notes/:id  →  Edit (only author) ───────────────────────────────
router.put('/:id', protect, upload.array('attachments'), async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (String(note.author) !== req.user._id)
      return res.status(403).json({ message: 'Not authorized to edit this note' });

    const { title, content, tags, isPublic, isPinned, isArchived } = req.body;

    if (title     !== undefined) note.title     = title;
    if (content   !== undefined) note.content   = content;
    if (tags      !== undefined) note.tags      = JSON.parse(tags);
    if (isPublic  !== undefined) note.isPublic  = isPublic;
    if (isPinned  !== undefined) note.isPinned  = isPinned;
    if (isArchived !== undefined) note.isArchived = isArchived;

    // Append new attachments if any
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename:     file.filename,
        originalName: file.originalname,
        mimetype:     file.mimetype,
        size:         file.size,
        path:         file.path
      }));
      note.attachments.push(...newAttachments);
    }

    note.updatedAt = Date.now();
    await note.save();
    await note.populate('author', 'name email');
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── PATCH /api/notes/:id/archive  →  Toggle archive (only author) ──────────
router.patch('/:id/archive', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (String(note.author) !== req.user._id)
      return res.status(403).json({ message: 'Not authorized' });

    note.isArchived = !note.isArchived;
    note.updatedAt  = Date.now();
    await note.save();
    await note.populate('author', 'name email');
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/notes/:id  →  Delete (only author) ─────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (String(note.author) !== req.user._id)
      return res.status(403).json({ message: 'Not authorized to delete this note' });

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;