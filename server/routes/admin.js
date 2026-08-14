import express from "express";

export default function adminRoutes(balanceCollection, adminTransactionsCollection) {
  const router = express.Router();

  // Get current balance
  router.get("/balance", async (req, res) => {
    const balanceDoc = await balanceCollection.findOne({ _id: "balance" });
    res.json({ currentBalance: balanceDoc?.currentBalance || 0 });
  });

  // Update balance (positive or negative) + log admin transaction
  router.post("/balance/update", async (req, res) => {
    const { amount } = req.body;
    const date = new Date();

    // Update balance
    await balanceCollection.updateOne(
      { _id: "balance" },
      { $inc: { currentBalance: amount } },
      { upsert: true }
    );

    // Log transaction in adminTransactions
    await adminTransactionsCollection.insertOne({
      amount,
      date,
      type: amount >= 0 ? "deposit" : "withdrawal",
      source: "admin",
    });

    const balanceDoc = await balanceCollection.findOne({ _id: "balance" });
    res.json({
      message: "Balance updated",
      currentBalance: balanceDoc.currentBalance,
    });
  });

  // Get admin transaction history
  router.get("/transactions", async (req, res) => {
    const history = await adminTransactionsCollection
      .find({})
      .sort({ date: -1 })
      .toArray();
    res.json(history);
  });

  return router;
}
