// routes/dashboard.js
import express from "express";

import auth from "../middleware/auth.js";
import Asset from "../models/Asset.js";
import Assignment from "../models/Assignment.js";
import Expenditure from "../models/Expenditure.js";
import Purchase from "../models/Purchase.js";
import Transfer from "../models/Transfer.js";

const router = express.Router();

// Helper: build date-range filter
const dateFilter = (start, end) => {
  const filter = {};
  if (start || end) filter.date = {};
  if (start) filter.date.$gte = new Date(start);
  if (end) filter.date.$lte = new Date(end);
  return filter;
};

// GET /api/dashboard?baseId=&type=&start=&end=
router.get("/dashboard", auth, async (req, res, next) => {
  try {
    const { baseId, type, start, end } = req.query;

    // 1. Asset query filter
    const assetFilter = {};
    if (baseId) assetFilter.baseId = baseId;
    if (type) assetFilter.type = type;

    // 2. Opening balance = total quantity in scope
    const assets = await Asset.find(assetFilter).lean();
    const openingBalance = assets.reduce((sum, a) => sum + a.quantity, 0);

    // 3. Date-range filters for movement events
    const purchaseFilter = { ...assetFilter, ...dateFilter(start, end) };
    const transferFilter = { ...dateFilter(start, end) };
    const assignFilter = { ...assetFilter, ...dateFilter(start, end) };
    const expendFilter = { ...assetFilter, ...dateFilter(start, end) };

    // 4. Purchases
    const purchases = await Purchase.find(purchaseFilter).lean();
    const purchasesQty = purchases.reduce((s, p) => s + p.quantity, 0);

    // 5. Transfers
    const transfers = await Transfer.find(transferFilter).lean();
    const transfersIn = transfers
      .filter((t) => !baseId || t.toBaseId.toString() === baseId)
      .reduce((s, t) => s + t.quantity, 0);
    const transfersOut = transfers
      .filter((t) => !baseId || t.fromBaseId.toString() === baseId)
      .reduce((s, t) => s + t.quantity, 0);

    // 6. Assignments
    const assignments = await Assignment.find(assignFilter).lean();
    const assigned = assignments.reduce((s, a) => s + a.quantity, 0);

    // 7. Expenditures
    const expenditures = await Expenditure.find(expendFilter).lean();
    const expended = expenditures.reduce((s, e) => s + e.quantity, 0);

    // 8. Closing balance
    const netMovement = purchasesQty + transfersIn - transfersOut - expended;
    const closingBalance = openingBalance + netMovement;

    res.json({
      openingBalance,
      closingBalance,
      netMovement,
      assigned,
      expended,
      purchasesQty,
      transfersIn,
      transfersOut,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
