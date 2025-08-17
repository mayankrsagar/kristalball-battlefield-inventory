import express from "express";
import { body, validationResult } from "express-validator";

import auth from "../middleware/auth.js";
import { allow, ownBase } from "../middleware/rbac.js";
import Assignment from "../models/Assignment.js";
import { logTx } from "../utils/audit.js";

const router = express.Router();

// GET /api/assignments?baseId=
router.get("/", auth, async (req, res, next) => {
  try {
    const filter = req.query.baseId ? { baseId: req.query.baseId } : {};
    const assignments = await Assignment.find(filter)
      .populate("assetId", "name type")
      .populate("baseId", "name")
      .sort({ assignmentDate: -1 });
    res.json(assignments);
  } catch (err) {
    next(err);
  }
});

// POST /api/assignments
router.post(
  "/",
  auth,
  allow("Admin", "BaseCommander"),
  ownBase,
  body("assetId").isMongoId(),
  body("baseId").isMongoId(),
  body("quantity").isInt({ min: 1 }),
  body("assignedTo").isString().trim().notEmpty(),
  body("assignmentDate").isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const assignment = await Assignment.create(req.body);
      logTx("ASSIGNMENT", assignment.toObject(), req.user._id);
      res.status(201).json(assignment);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
