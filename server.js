import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// === Rate Limiting ===
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 хвилина
  max: 15, // максимум 15 запитів з одного IP
  message: { error: "Too many requests. Please wait a moment." },
});

// застосовуємо ліміт тільки до /send-email
app.use("/send-email", limiter);

// === Static + Routes ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use("/", emailRoutes);

// === Health Check ===
app.get("/status", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});