import express from "express";
import { ObjectId } from "mongodb";

export default function inventoryRoutes(inventoryCollection, balanceCollection, transactionsCollection) {
  const router = express.Router();

  // Get all products
  router.get("/", async (req, res) => {
    try {
      const products = await inventoryCollection.find({}).toArray();
      res.status(200).json({ success: true, products });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to fetch inventory" });
    }
  });

  // Add product (buying new stock)
  router.post("/add", async (req, res) => {
    const { name, image, wholesalePrice, mrp, quantity } = req.body;
    const totalCost = wholesalePrice * quantity;

    try {
      const balanceDoc = await balanceCollection.findOne({ _id: "balance" });
      if (!balanceDoc || balanceDoc.currentBalance < totalCost) {
        return res.status(400).json({ success: false, error: "Insufficient balance to buy product" });
      }

      await inventoryCollection.insertOne({ name, image, wholesalePrice, mrp, quantity });
      await balanceCollection.updateOne({ _id: "balance" }, { $inc: { currentBalance: -totalCost } });

      await transactionsCollection.insertOne({
        type: "buy",
        product: name,
        units: quantity,
        wholesalePrice,
        mrp,
        totalCost,
        date: new Date()
      });

      const updatedBalance = await balanceCollection.findOne({ _id: "balance" });
      res.status(200).json({ success: true, message: "Product added", currentBalance: updatedBalance.currentBalance });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to add product" });
    }
  });

  // Buy more units of existing product
  router.post("/buy", async (req, res) => {
    const { productId, units } = req.body;
    try {
      const product = await inventoryCollection.findOne({ _id: new ObjectId(productId) });
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });

      const totalCost = product.wholesalePrice * units;
      const balanceDoc = await balanceCollection.findOne({ _id: "balance" });
      if (!balanceDoc || balanceDoc.currentBalance < totalCost) {
        return res.status(400).json({ success: false, error: "Insufficient balance" });
      }

      await inventoryCollection.updateOne({ _id: new ObjectId(productId) }, { $inc: { quantity: units } });
      await balanceCollection.updateOne({ _id: "balance" }, { $inc: { currentBalance: -totalCost } });

      await transactionsCollection.insertOne({
        type: "buy",
        product: product.name,
        units,
        wholesalePrice: product.wholesalePrice,
        mrp: product.mrp,
        totalCost,
        date: new Date()
      });

      res.status(200).json({ success: true, message: "Units bought successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to buy units" });
    }
  });

  // Sell product units
  router.post("/sell", async (req, res) => {
    const { productId, units } = req.body;
    try {
      const product = await inventoryCollection.findOne({ _id: new ObjectId(productId) });
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });

      if (product.quantity < units) {
        return res.status(400).json({ success: false, error: "Not enough stock to sell" });
      }

      const totalRevenue = product.mrp * units;
      await inventoryCollection.updateOne({ _id: new ObjectId(productId) }, { $inc: { quantity: -units } });
      await balanceCollection.updateOne({ _id: "balance" }, { $inc: { currentBalance: totalRevenue } });

      await transactionsCollection.insertOne({
        type: "sell",
        product: product.name,
        units,
        wholesalePrice: product.wholesalePrice,
        mrp: product.mrp,
        totalRevenue,
        date: new Date()
      });

      res.status(200).json({ success: true, message: "Units sold successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to sell units" });
    }
  });

  // Update product prices
  router.post("/updatePrice", async (req, res) => {
    const { productId, newWholesalePrice, newMrp } = req.body;
    try {
      const product = await inventoryCollection.findOne({ _id: new ObjectId(productId) });
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });

      await inventoryCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: { wholesalePrice: newWholesalePrice, mrp: newMrp } }
      );

      await transactionsCollection.insertOne({
        type: "update",
        product: product.name,
        oldWholesalePrice: product.wholesalePrice,
        oldMrp: product.mrp,
        newWholesalePrice,
        newMrp,
        date: new Date()
      });

      res.status(200).json({ success: true, message: "Prices updated successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to update prices" });
    }
  });

  return router;
}
