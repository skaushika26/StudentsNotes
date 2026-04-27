const express = require("express");
const router = express.Router();
const Note = require("../models/Note");


// ➤ CREATE NOTE
router.post("/", async (req, res) => {
  try {
    const note = new Note(req.body);
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ➤ GET ALL NOTES
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ➤ UPDATE NOTE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ➤ DELETE NOTE
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;