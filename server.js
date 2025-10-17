import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "./mailgun.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 ВАЖЛИВО: показуємо статичні файли з папки public
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Головна сторінка — показує index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 Маршрут для надсилання email
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const result = await sendEmail(to, subject, text, html);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Mailgun error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});