const express = require("express");
const router = express.Router();
const { auth, isStudent } = require("../middlewares/auth");
const {
    createNote,
    getUserNotes,
    updateNote,
    deleteNote
} = require("../controllers/noteController");

// Create a new note
router.post("/", auth, isStudent, createNote);

// Get user's notes (optionally filtered by course)
router.get("/", auth, isStudent, getUserNotes);

// Update a note
router.put("/:noteId", auth, isStudent, updateNote);

// Delete a note
router.delete("/:noteId", auth, isStudent, deleteNote);

module.exports = router;
