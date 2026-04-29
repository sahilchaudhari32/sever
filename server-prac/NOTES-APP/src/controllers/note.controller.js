const mongoose = require("mongoose");
const Note = require("../models/note.model");

// helper response functions
const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data
  });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content || !title.trim() || !content.trim()) {
      return sendError(res, 400, "Title and content are required");
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned
    });

    return sendSuccess(res, 201, "Note created successfully", note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Internal server error");
  }
};

// 2. POST /api/notes/bulk
const createNotesBulk = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!Array.isArray(notes) || notes.length === 0) {
      return sendError(res, 400, "Notes array is required and cannot be empty");
    }

    const hasInvalidNote = notes.some(
      (note) =>
        !note.title ||
        !note.content ||
        !String(note.title).trim() ||
        !String(note.content).trim()
    );

    if (hasInvalidNote) {
      return sendError(res, 400, "Each note must have title and content");
    }

    const preparedNotes = notes.map((note) => ({
      title: String(note.title).trim(),
      content: String(note.content).trim(),
      category: note.category,
      isPinned: note.isPinned
    }));

    const createdNotes = await Note.insertMany(preparedNotes, {
      ordered: true
    });

    return sendSuccess(
      res,
      201,
      `${createdNotes.length} notes created successfully`,
      createdNotes
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Internal server error");
  }
};

// 3. GET /api/notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Notes fetched successfully", notes);
  } catch (error) {
    return sendError(res, 500, "Internal server error");
  }
};

// 4. GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note id");
    }

    const note = await Note.findById(id);

    if (!note) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note fetched successfully", note);
  } catch (error) {
    return sendError(res, 500, "Internal server error");
  }
};

// 5. PUT /api/notes/:id
const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, isPinned } = req.body;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note id");
    }

    if (
      title === undefined ||
      content === undefined ||
      category === undefined ||
      isPinned === undefined
    ) {
      return sendError(
        res,
        400,
        "All fields are required for full replacement: title, content, category, isPinned"
      );
    }

    if (!String(title).trim() || !String(content).trim()) {
      return sendError(res, 400, "Title and content are required");
    }

    const note = await Note.findOneAndReplace(
      { _id: id },
      {
        title: String(title).trim(),
        content: String(content).trim(),
        category,
        isPinned
      },
      {
        new: true,
        runValidators: true,
        overwrite: true
      }
    );

    if (!note) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note replaced successfully", note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Internal server error");
  }
};

// 6. PATCH /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note id");
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return sendError(res, 400, "No fields provided to update");
    }

    if (
      updateData.title !== undefined &&
      !String(updateData.title).trim()
    ) {
      return sendError(res, 400, "Title cannot be empty");
    }

    if (
      updateData.content !== undefined &&
      !String(updateData.content).trim()
    ) {
      return sendError(res, 400, "Content cannot be empty");
    }

    if (updateData.title !== undefined) {
      updateData.title = String(updateData.title).trim();
    }

    if (updateData.content !== undefined) {
      updateData.content = String(updateData.content).trim();
    }

    const note = await Note.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!note) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note updated successfully", note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendError(res, 400, error.message);
    }

    return sendError(res, 500, "Internal server error");
  }
};

// 7. DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note id");
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note deleted successfully", null);
  } catch (error) {
    return sendError(res, 500, "Internal server error");
  }
};

// 8. DELETE /api/notes/bulk
const deleteNotesBulk = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 400, "ids array is required and cannot be empty");
    }

    const hasInvalidId = ids.some((id) => !isValidObjectId(id));

    if (hasInvalidId) {
      return sendError(res, 400, "One or more note ids are invalid");
    }

    const result = await Note.deleteMany({
      _id: { $in: ids }
    });

    return sendSuccess(
      res,
      200,
      `${result.deletedCount} notes deleted successfully`,
      null
    );
  } catch (error) {
    console.log("Delete bulk error:", error);

    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createNote,
  createNotesBulk,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteNotesBulk
};