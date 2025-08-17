// routes/dashboard.js
import express from "express";

import auth from "../middleware/auth.js";
import { calcNetMovement } from "../utils/balance.js";

const router = express.Router();

router.get("/dashboard", auth, async (req, res, next) => {
  try {
    const { baseId, type, start, end } = req.query;
    // TODO: validate & parse dates
    const movement = await calcNetMovement(/* params */);
    res.json({ movement });
  } catch (err) {
    next(err);
  }
});

export default router;
