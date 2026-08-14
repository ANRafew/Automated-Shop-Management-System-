import express from "express";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js"; // your firebase config
import { ObjectId } from "mongodb";

const router = express.Router();

export default function authRoutes(usersCollection) {
  // Staff Signup (role always = staff)
  router.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      // Register in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save role in MongoDB (force staff)
      await usersCollection.insertOne({
        _id: new ObjectId(),
        name,
        email,
        role: "staff"
      });

      res.json({ message: "Staff signup successful", uid: user.uid });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(400).json({ error: err.message });
    }
  });

  // Login (checks role)
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch role from MongoDB
      const record = await usersCollection.findOne({ email });
      if (!record) {
        return res.status(404).json({ error: "User not found in MongoDB" });
      }

      res.json({
        message: "Login successful",
        uid: user.uid,
        role: record.role
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
