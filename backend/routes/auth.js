import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

// read keys once at startup i made use of fs.
const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, "utf8");
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, "utf8");

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role, baseId } = req.body;

    // quick validation
    if (!["Admin", "BaseCommander", "LogisticsOfficer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (role !== "Admin" && !baseId) {
      return res.status(400).json({ message: "baseId required for non-Admin" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role, baseId });

    res.status(201).json({ id: user._id, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // console.log(`User found: ${user ? user.email : "No user found"}`);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    //jwt sign accepts payload, secret key and options
    const token = jwt.sign(
      { id: user._id, role: user.role, baseId: user.baseId },
      privateKey,
      { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
