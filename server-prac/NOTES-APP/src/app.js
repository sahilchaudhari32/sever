// src/app.js

const express    = require('express');
const noteRoutes = require("./routes/note.routes");
// const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//test route
app.get("/test", (req, res) => {
  res.status(200).json({ msg: "test route working fine." });
});

// Routes
app.use('/api/notes', noteRoutes);

// 404 — no route matched
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found.' });
});

// Error handling
// app.use(errorHandler);

module.exports = app;