import express from "express";

export default function transactionsRoutes(transactionsCollection) {
  const router = express.Router();

  // Get all transactions
  router.get("/", async (req, res) => {
    try {
      const transactions = await transactionsCollection
        .find({})
        .sort({ date: -1 }) // newest first
        .toArray();

      res.json({ Transactions: transactions });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  return router;
}
