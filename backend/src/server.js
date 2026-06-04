import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { sendMessage, getChats, getChat, deleteChat } from "./controllers/chatController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected!"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.post("/api/chat", sendMessage);
app.get("/api/chats", getChats);
app.get("/api/chats/:id", getChat);
app.delete("/api/chats/:id", deleteChat);

app.get("/", (req, res) => res.send("Backend Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));