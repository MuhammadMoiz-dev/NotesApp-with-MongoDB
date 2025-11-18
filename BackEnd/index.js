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

// 🧩 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "https://notes-app-with-mongo-db-ccnn.vercel.app", // your frontend URL
        credentials: true,               // allow sending cookies
    })
);
connnectDB()

// 🏠 Test route
app.get("/", (req, res) => {
    res.send({ ok: true, message: "API working fine", time: new Date() });
});

// 🧾 Register route
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

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
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// 🔐 Login route (sets JWT in cookie)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ Email: email.toLowerCase() });

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Changed from "7d" to "1d"
        );

        // Store token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true if HTTPS
            sameSite: "lax",
            maxAge: 1 * 24 * 60 * 60 * 1000, // Changed from 7 days to 1 day
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

// 🧠 Middleware to protect routes
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

// 👤 Get logged-in user info
app.get("/me", authMiddleware, async (req, res) => {
    const user = await UserModel.findById(req.user.userId).select("-Password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { id: user._id, name: user.Name, email: user.Email } });
});

// 🚪 Logout route
app.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.json({ message: "Logout successful" });
});

// 📝 NOTES ROUTES

// 🆕 Create a new note
app.post("/notes", authMiddleware, async (req, res) => {
    try {
        const { Note } = req.body; // Changed from 'note' to 'Note'

        if (!Note || !Note.trim()) {
            return res.status(400).json({ error: "Note content is required" });
        }

        const newNote = await NotesModel.create({
            Note: Note.trim(),
            user: req.user.userId
        });

        res.status(201).json({
            message: "Note created successfully",
            note: newNote
        });
    } catch (error) {
        console.error("Create note error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 📖 Get all notes for logged-in user
app.get("/notes", authMiddleware, async (req, res) => {
    try {
        const notes = await NotesModel.find({ user: req.user.userId })
            .sort({ createdAt: -1 });

        res.json({
            message: "Notes fetched successfully",
            notes: notes
        });
    } catch (error) {
        console.error("Get notes error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✏️ Update a note
app.put("/notes/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { Note } = req.body; // Changed from 'note' to 'Note'

        if (!Note || !Note.trim()) {
            return res.status(400).json({ error: "Note content is required" });
        }

        const noteDoc = await NotesModel.findOne({ _id: id, user: req.user.userId });
        if (!noteDoc) {
            return res.status(404).json({ error: "Note not found" });
        }

        noteDoc.Note = Note.trim();
        await noteDoc.save();

        res.json({
            message: "Note updated successfully",
            note: noteDoc
        });
    } catch (error) {
        console.error("Update note error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 🗑️ Delete a note
app.delete("/notes/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const note = await NotesModel.findOne({ _id: id, user: req.user.userId });
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        await NotesModel.findByIdAndDelete(id);

        res.json({
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 🔍 Get single note
app.get("/notes/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const note = await NotesModel.findOne({ _id: id, user: req.user.userId });
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.json({
            message: "Note fetched successfully",
            note: note
        });
    } catch (error) {
        console.error("Get note error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 🚀 Start server
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});