import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "./mailgun.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

// --- Шляхи ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Віддавати всі файли з public ---
app.use(express.static(path.join(__dirname, "public")));

// --- Головна сторінка ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Основний маршрут для відправки листів ---
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

// --- 404: якщо користувач заходить на неіснуючий маршрут ---
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Запуск сервера ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});