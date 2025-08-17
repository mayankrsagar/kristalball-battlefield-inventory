import express from "express";

import auth from "../middleware/auth.js";
import { allow } from "../middleware/rbac.js";
import Base from "../models/Base.js";

const router = express.Router();

// GET /api/bases
router.get("/", async (_req, res, next) => {
  try {
    const bases = await Base.find().lean();
    res.json(bases);
  } catch (err) {
    next(err);
  }
});

// POST /api/bases   (Admin only)
router.post("/", auth, allow("Admin"), async (req, res, next) => {
  try {
    const user = req.user;
    console.log(`User ${user._id} is creating a new base`);
    if (!req.body.name) {
      return res.status(400).json({ error: "Base name is required" });
    }
    const base = await Base.create(req.body);
    res.status(201).json(base);
  } catch (err) {
    next(err);
  }
});

export default router;
