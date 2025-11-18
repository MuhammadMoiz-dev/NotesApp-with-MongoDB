// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserModel from "./models/UserSchema.js";
import NotesModel from "./models/NotesSchema.js";
import connnectDB from "./config/dbconnect.js";

dotenv.config();

const app = express();

// -------------------
// MIDDLEWARE
// -------------------
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://notes-app-with-mongo-db-ccnn-e2brltg1p.vercel.app",
      "https://notes-app-with-mong-git-001cb3-muhammad-moizs-projects-89d7cc44.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Connect MongoDB
connnectDB();

// -------------------
// TEST ROUTE
// -------------------
app.get("/", (req, res) => {
  res.send({ ok: true, message: "API working fine", time: new Date() });
});

// -------------------
// REGISTER
// -------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await UserModel.findOne({ Email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      Name: name,
      Email: email.toLowerCase(),
      Password: hashed,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.Name, email: user.Email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------
// LOGIN
// -------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ Email: email.toLowerCase() });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 Cookie settings FIXED for Vercel
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required on vercel
      sameSite: "none", // required on vercel
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.Name, email: user.Email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------
// AUTH MIDDLEWARE
// -------------------
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// -------------------
// GET LOGGED-IN USER
// -------------------
app.get("/me", authMiddleware, async (req, res) => {
  const user = await UserModel.findById(req.user.userId).select("-Password");
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    user: { id: user._id, name: user.Name, email: user.Email },
  });
});

// -------------------
// LOGOUT
// -------------------
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Logout successful" });
});

// -------------------
// NOTES ROUTES
// -------------------

// Create note
app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { Note } = req.body;

    if (!Note || !Note.trim())
      return res.status(400).json({ error: "Note content required" });

    const newNote = await NotesModel.create({
      Note: Note.trim(),
      user: req.user.userId,
    });

    res.status(201).json({
      message: "Note created",
      note: newNote,
    });
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get notes
app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await NotesModel.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json({
      message: "Notes fetched",
      notes: notes,
    });
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update note
app.put("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { Note } = req.body;

    if (!Note || !Note.trim())
      return res.status(400).json({ error: "Note content required" });

    const note = await NotesModel.findOne({ _id: id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: "Note not found" });

    note.Note = Note.trim();
    await note.save();

    res.json({
      message: "Note updated",
      note: note,
    });
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete note
app.delete("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await NotesModel.findOne({ _id: id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: "Note not found" });

    await NotesModel.findByIdAndDelete(id);

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single note
app.get("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await NotesModel.findOne({ _id: id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({
      message: "Note fetched",
      note: note,
    });
  } catch (err) {
    console.error("Get note error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------
// START SERVER (LOCAL ONLY)
// -------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
