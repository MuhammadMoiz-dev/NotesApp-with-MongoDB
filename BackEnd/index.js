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

// ------------------ MIDDLEWARE ------------------
app.use(express.json());
app.use(cookieParser());

// CORS FIX FOR VERCEL
app.use(
  cors({
    origin: [
      "https://notes-app-with-mongo-db-ccnn-e2brltg1p.vercel.app",
      "https://notes-app-with-mong-git-001cb3-muhammad-moizs-projects-89d7cc44.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

connnectDB();

// ------------------ TEST ROUTE ------------------
app.get("/", (req, res) => {
  res.send({ ok: true, message: "API working fine", time: new Date() });
});

// ------------------ REGISTER ------------------
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

// ------------------ LOGIN ------------------
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

    // Cookie fix for Vercel ❤️
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // REQUIRED on Vercel
      sameSite: "none", // REQUIRED for cross-domain
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.Name, email: user.Email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ AUTH MIDDLEWARE ------------------
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ------------------ GET LOGGED USER ------------------
app.get("/me", authMiddleware, async (req, res) => {
  const user = await UserModel.findById(req.user.userId).select("-Password");
  res.json({ user });
});

// ------------------ LOGOUT ------------------
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out" });
});

// ------------------ NOTES CRUD ------------------
app.post("/notes", authMiddleware, async (req, res) => {
  const { Note } = req.body;
  if (!Note?.trim())
    return res.status(400).json({ error: "Note content required" });

  const note = await NotesModel.create({
    Note: Note.trim(),
    user: req.user.userId,
  });

  res.status(201).json({ message: "Note created", note });
});

app.get("/notes", authMiddleware, async (req, res) => {
  const notes = await NotesModel.find({ user: req.user.userId }).sort({
    createdAt: -1,
  });
  res.json({ notes });
});

app.put("/notes/:id", authMiddleware, async (req, res) => {
  const { Note } = req.body;
  if (!Note?.trim())
    return res.status(400).json({ error: "Note required" });

  const note = await NotesModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    { Note: Note.trim() },
    { new: true }
  );

  if (!note) return res.status(404).json({ error: "Note not found" });

  res.json({ message: "Updated", note });
});

app.delete("/notes/:id", authMiddleware, async (req, res) => {
  const note = await NotesModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!note) return res.status(404).json({ error: "Note not found" });

  res.json({ message: "Deleted" });
});

// ------------------ START SERVER ------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
