import express from "express";
import { body, validationResult } from "express-validator";

import auth from "../middleware/auth.js";
import { allow, ownBase } from "../middleware/rbac.js";
import Purchase from "../models/Purchase.js";
import { logTx } from "../utils/audit.js";

const router = express.Router();

// GET /api/purchases?baseId=&type=&start=&end=
router.get("/", auth, async (req, res, next) => {
  try {
    const { baseId, start, end } = req.query;
    const filter = {};
    if (baseId) filter.baseId = baseId;
    if (start || end) {
      filter.purchaseDate = {};
      if (start) filter.purchaseDate.$gte = new Date(start);
      if (end) filter.purchaseDate.$lte = new Date(end);
    }
    const purchases = await Purchase.find(filter)
      .populate("assetId", "name type")
      .populate("addedBy", "name")
      .sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (err) {
    next(err);
  }
});

// POST /api/purchases
router.post(
  "/",
  auth,
  allow("Admin", "LogisticsOfficer"),
  ownBase,
  body("assetId").isMongoId(),
  body("baseId").isMongoId(),
  body("quantity").isInt({ min: 1 }),
  body("purchaseDate").isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const purchase = await Purchase.create({
        ...req.body,
        addedBy: req.user._id,
      });
      logTx("PURCHASE", purchase.toObject(), req.user._id);
      res.status(201).json(purchase);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
