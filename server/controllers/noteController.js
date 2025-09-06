const Note = require("../models/Note");
const { default: mongoose } = require("mongoose");

exports.createNote = async (req, res) => {
    try {
        const { courseId, title, content, tags } = req.body;
        const userId = req.user.id;

        console.log('Creating note with data:', { courseId, title, content, tags, userId });

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        // Prepare note data
        const noteData = {
            user: userId,
            title,
            content,
            tags: tags || []
        };

        // Add course if provided and valid
        if (courseId && courseId !== 'null' && courseId !== 'undefined' && courseId !== 'general') {
            noteData.course = courseId;
        }

        console.log('Creating note with final data:', noteData);
        const note = await Note.create(noteData);
        console.log('Note created successfully:', note);

        // Populate course details in the response
        const populatedNote = await Note.findById(note._id).populate('course', 'courseName');

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: populatedNote
        });
    } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create note",
            error: error.message
        });
    }
};

exports.getUserNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.query;

        const query = { user: userId };
        if (courseId) {
            query.course = courseId;
        }

        const notes = await Note.find(query)
            .populate('course', 'courseName')
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            data: notes
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
            error: error.message
        });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content, tags } = req.body;
        const userId = req.user.id;

        const note = await Note.findOneAndUpdate(
            { _id: noteId, user: userId },
            { title, content, tags, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found or unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note
        });
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update note",
            error: error.message
        });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const note = await Note.findOneAndDelete({ _id: noteId, user: userId });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found or unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete note",
            error: error.message
        });
    }
};
