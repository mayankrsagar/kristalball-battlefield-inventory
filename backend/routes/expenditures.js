import express from "express";
import { body, validationResult } from "express-validator";

import auth from "../middleware/auth.js";
import { allow, ownBase } from "../middleware/rbac.js";
import Expenditure from "../models/Expenditure.js";
import { logTx } from "../utils/audit.js";

const router = express.Router();

// GET /api/expenditures?baseId=&start=&end=
router.get("/", auth, async (req, res, next) => {
  try {
    const { baseId, start, end } = req.query;
    const filter = {};
    if (baseId) filter.baseId = baseId;
    if (start || end) {
      filter.dateExpended = {};
      if (start) filter.dateExpended.$gte = new Date(start);
      if (end) filter.dateExpended.$lte = new Date(end);
    }
    const expenditures = await Expenditure.find(filter)
      .populate("assetId", "name type")
      .populate("baseId", "name")
      .sort({ dateExpended: -1 });
    res.json(expenditures);
  } catch (err) {
    next(err);
  }
});

// POST /api/expenditures
router.post(
  "/",
  auth,
  allow("Admin", "BaseCommander"),
  ownBase,
  body("assetId").isMongoId(),
  body("baseId").isMongoId(),
  body("quantity").isInt({ min: 1 }),
  body("reason").isIn(["Used", "Damaged", "Expired"]),
  body("dateExpended").isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const expenditure = await Expenditure.create(req.body);
      logTx("EXPENDITURE", expenditure.toObject(), req.user._id);
      res.status(201).json(expenditure);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
