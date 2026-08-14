import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

const uri = process.env.MONGO_URI; // USE *YOUR* MONGODB PROJECTS CLUSTER CONNECTION STRING WITHOUT *SRV*

const client = new MongoClient(uri);

export async function connectDB() {
  await client.connect();
  console.log("✅ Connected to MongoDB Atlas");
  return client.db("shopdb"); // return the database object
}