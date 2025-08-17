import express from "express";
import { body, validationResult } from "express-validator";

import auth from "../middleware/auth.js";
import { allow, ownBase } from "../middleware/rbac.js";
import Transfer from "../models/Transfer.js";
import { logTx } from "../utils/audit.js";

const router = express.Router();

// GET /api/transfers?baseId=&start=&end=
router.get("/", auth, async (req, res, next) => {
  try {
    const { baseId, start, end } = req.query;
    const filter = {};
    if (baseId) {
      filter.$or = [{ fromBaseId: baseId }, { toBaseId: baseId }];
    }
    if (start || end) {
      filter.transferDate = {};
      if (start) filter.transferDate.$gte = new Date(start);
      if (end) filter.transferDate.$lte = new Date(end);
    }
    const transfers = await Transfer.find(filter)
      .populate("assetId", "name type")
      .populate("fromBaseId toBaseId", "name")
      .populate("initiatedBy", "name")
      .sort({ transferDate: -1 });
    res.json(transfers);
  } catch (err) {
    next(err);
  }
});

// POST /api/transfers
router.post(
  "/",
  auth,
  allow("Admin", "BaseCommander", "LogisticsOfficer"),
  ownBase, // checks req.body.fromBaseId
  body("assetId").isMongoId(),
  body("fromBaseId").isMongoId(),
  body("toBaseId").isMongoId(),
  body("quantity").isInt({ min: 1 }),
  body("transferDate").isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const transfer = await Transfer.create({
        ...req.body,
        initiatedBy: req.user._id,
      });
      logTx("TRANSFER", transfer.toObject(), req.user._id);
      res.status(201).json(transfer);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
