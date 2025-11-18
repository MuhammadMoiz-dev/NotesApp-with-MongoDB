import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });

    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET LOGGED IN USER
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not logged in" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
