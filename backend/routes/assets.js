import express from "express";

import auth from "../middleware/auth.js";
import { allow } from "../middleware/rbac.js";
import Asset from "../models/Asset.js";

const router = express.Router();

// GET /api/assets?baseId=<id>&type=Weapon
router.get("/", async (req, res, next) => {
  try {
    const { baseId, type } = req.query;
    const filter = {};
    if (baseId) filter.baseId = baseId;
    if (type) filter.type = type;
    const assets = await Asset.find(filter).populate("baseId", "name").lean();
    res.json(assets);
  } catch (err) {
    next(err);
  }
});

// POST /api/assets   (Admin only)
router.post("/", auth, allow("Admin"), async (req, res, next) => {
  try {
    // was going for manuall validation but this is handled by middleware
    // const baseId = req.body.baseId;
    // if (!baseId) {
    //   return res.status(400).json({ error: "Base ID is required" });
    // }
    // const baseExists = await Base.findById(baseId);
    // if (!baseExists) {
    //   return res.status(404).json({ error: "Base not found" });
    // }
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
});

export default router;
