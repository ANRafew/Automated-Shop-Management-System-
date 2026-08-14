// server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const db = await connectDB();
  const usersCollection = db.collection("users");

  // Auth routes
  app.use("/auth", authRoutes(usersCollection));
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
}
startServer();