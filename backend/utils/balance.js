import Expenditure from "../models/Expenditure.js";
import Purchase from "../models/Purchase.js";
import Transfer from "../models/Transfer.js";

export async function calcNetMovement(assetId, baseId, start, end) {
  const [purchases, transfersIn, transfersOut, expended] = await Promise.all([
    Purchase.aggregate([
      { $match: { assetId, baseId, purchaseDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
    ]),
    Transfer.aggregate([
      {
        $match: {
          assetId,
          toBaseId: baseId,
          transferDate: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
    ]),
    Transfer.aggregate([
      {
        $match: {
          assetId,
          fromBaseId: baseId,
          transferDate: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
    ]),
    Expenditure.aggregate([
      { $match: { assetId, baseId, dateExpended: { $gte: start, $lte: end } } },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
    ]),
  ]);

  const p = purchases[0]?.qty || 0;
  const ti = transfersIn[0]?.qty || 0;
  const to = transfersOut[0]?.qty || 0;
  const e = expended[0]?.qty || 0;
  return {
    purchases: p,
    transfersIn: ti,
    transfersOut: to,
    expended: e,
    netMovement: p + ti - to - e,
  };
}
