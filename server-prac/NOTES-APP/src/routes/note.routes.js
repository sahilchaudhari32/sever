const express = require("express");
const {
  createNote,
  createNotesBulk,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteNotesBulk
} = require("../controllers/note.controller");
const logger = require("../middlewares/logger.middleware");
// const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", createNote);
router.post("/bulk", createNotesBulk);
router.get("/", logger, getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/bulk", deleteNotesBulk);
router.delete("/:id", deleteNote);

module.exports = router;