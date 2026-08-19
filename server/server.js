// server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import inventoryRoutes from "./routes/inventory.js";
import transactionsRoutes from "./routes/transactions.js";

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const db = await connectDB();
  const usersCollection = db.collection("users");
  const balanceCollection = db.collection("balance");
  const adminTransactionsCollection = db.collection("adminTransactions");
  const inventoryCollection = db.collection("inventory");
  const transactionsCollection = db.collection("transactions");

  // Auth routes
  app.use("/auth", authRoutes(usersCollection));
  app.use("/admin", adminRoutes(balanceCollection, adminTransactionsCollection));
  app.use("/inventory", inventoryRoutes(inventoryCollection, balanceCollection, transactionsCollection));
  app.use("/transactions", transactionsRoutes(transactionsCollection));
  
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
}
startServer();