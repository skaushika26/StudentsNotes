const express  = require("express");
const bcrypt   = require("bcryptjs");
const User     = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { protect } = require("../middleware/auth");

const router = express.Router();

/* ──────────────────────────────────────────────
   POST  /api/auth/register
   Body: { name, email, password }
────────────────────────────────────────────── */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const token = generateToken({ id: user._id, email: user.email });

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("[register]", err);
    return res.status(500).json({ message: "Server error – please try again" });
  }
});

/* ──────────────────────────────────────────────
   POST  /api/auth/login
   Body: { email, password }
────────────────────────────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Generic message – don't reveal whether email exists
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = generateToken({ id: user._id, email: user.email });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ message: "Server error – please try again" });
  }
});

/* ──────────────────────────────────────────────
   GET  /api/auth/me   (protected example route)
────────────────────────────────────────────── */
router.get("/me", protect, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
