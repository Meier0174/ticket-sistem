import express from "express";
import dotenv from "dotenv";
import { sendEmail } from "./mailgun.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// Головна сторінка
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Основний маршрут для відправки листів
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    const result = await sendEmail(to, subject, text);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Mailgun error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});