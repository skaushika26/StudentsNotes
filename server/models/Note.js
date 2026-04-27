const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);