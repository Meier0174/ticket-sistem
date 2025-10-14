import express from "express";
import dotenv from "dotenv";
import { sendEmail } from "./mailgun.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Тестовий маршрут
app.get("/", (req, res) => {
  res.send("✅ Test server running at http://localhost:" + PORT);
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